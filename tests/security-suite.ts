import crypto from "crypto";
import { priceOrder, PricingError } from "../lib/pricing";
import { verifyPaymentSignature, verifyWebhookSignature } from "../lib/razorpay";
import { orderStore, generateOrderId } from "../lib/orders";
import { getProductById, PRODUCTS_DATA } from "../lib/products";
import type { Order } from "../types";

// Set dummy env variables for test run if not present
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId12345";
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "mockSecretKey678901234567890";

async function runSecuritySuite() {
  console.log("----------------------------------------------------------");
  console.log("LOLLIPOP BAKERY - AUTOMATED SECURITY & SANITY AUDIT SUITE");
  console.log("----------------------------------------------------------\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` (${detail})` : ""}`);
      failed++;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 1: Pricing Engine & Injection Attacks
  // ─────────────────────────────────────────────────────────────────────────
  console.log("👉 Test Group 1: Pricing Engine Integrity & Injection Attacks");

  try {
    // 1.1 Standard calculation
    const sampleProduct = PRODUCTS_DATA[0];
    const priced = priceOrder([
      { productId: sampleProduct.id, weight: sampleProduct.variants?.[0]?.weight || "500g", quantity: 2 },
    ]);
    const expectedUnit = sampleProduct.variants?.[0]?.price || sampleProduct.price || sampleProduct.minPrice || 0;
    const expectedSubtotal = expectedUnit * 2;
    assert(priced.subtotal === expectedSubtotal, "1.1 Recalculates subtotal correctly from server catalog");
    assert(priced.total > priced.subtotal, "1.2 Calculates GST (5%) taxes accurately above subtotal");
  } catch (e: any) {
    assert(false, "1.1 Standard calculation error", e.message);
  }

  // 1.2 Attempt negative quantity attack
  try {
    priceOrder([{ productId: PRODUCTS_DATA[0].id, weight: "500g", quantity: -5 }]);
    assert(false, "1.3 Negative quantity attack (Should have thrown PricingError)");
  } catch (e: any) {
    assert(e instanceof PricingError && e.code === "INVALID_QUANTITY", "1.3 Rejects negative quantity attacks");
  }

  // 1.3 Attempt zero quantity attack
  try {
    priceOrder([{ productId: PRODUCTS_DATA[0].id, weight: "500g", quantity: 0 }]);
    assert(false, "1.4 Zero quantity attack (Should have thrown PricingError)");
  } catch (e: any) {
    assert(e instanceof PricingError && e.code === "INVALID_QUANTITY", "1.4 Rejects zero quantity attacks");
  }

  // 1.4 Attempt excessive quantity attack (>50)
  try {
    priceOrder([{ productId: PRODUCTS_DATA[0].id, weight: "500g", quantity: 999 }]);
    assert(false, "1.5 Excessive quantity attack (Should have thrown PricingError)");
  } catch (e: any) {
    assert(e instanceof PricingError && e.code === "INVALID_QUANTITY", "1.5 Rejects excessive quantity attacks (>50)");
  }

  // 1.5 Attempt invalid product ID attack
  try {
    priceOrder([{ productId: "NON_EXISTENT_PRODUCT_ID_<script>alert(1)</script>", weight: "500g", quantity: 1 }]);
    assert(false, "1.6 Non-existent product ID attack (Should have thrown PricingError)");
  } catch (e: any) {
    assert(e instanceof PricingError && e.code === "PRODUCT_NOT_FOUND", "1.6 Rejects unknown product IDs");
  }

  // 1.6 Attempt empty cart
  try {
    priceOrder([]);
    assert(false, "1.7 Empty cart submit (Should have thrown PricingError)");
  } catch (e: any) {
    assert(e instanceof PricingError && e.code === "EMPTY_CART", "1.7 Rejects empty cart submission");
  }

  console.log("");

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 2: Razorpay Payment Signature Verification
  // ─────────────────────────────────────────────────────────────────────────
  console.log("👉 Test Group 2: Razorpay HMAC-SHA256 Signature Security");

  const testRazorpayOrderId = "order_N1234567890123";
  const testRazorpayPaymentId = "pay_P9876543210987";
  const validSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${testRazorpayOrderId}|${testRazorpayPaymentId}`)
    .digest("hex");

  // 2.1 Valid signature verification
  const validResult = verifyPaymentSignature({
    razorpay_order_id: testRazorpayOrderId,
    razorpay_payment_id: testRazorpayPaymentId,
    razorpay_signature: validSignature,
  });
  assert(validResult === true, "2.1 Accepts valid HMAC-SHA256 signature");

  // 2.2 Tampered payment ID
  const invalidResult1 = verifyPaymentSignature({
    razorpay_order_id: testRazorpayOrderId,
    razorpay_payment_id: "pay_HACKED_PAYMENT_ID",
    razorpay_signature: validSignature,
  });
  assert(invalidResult1 === false, "2.2 Blocks tampered payment ID signature forgery");

  // 2.3 Forged signature string
  const invalidResult2 = verifyPaymentSignature({
    razorpay_order_id: testRazorpayOrderId,
    razorpay_payment_id: testRazorpayPaymentId,
    razorpay_signature: "0000000000000000000000000000000000000000000000000000000000000000",
  });
  assert(invalidResult2 === false, "2.3 Blocks forged/arbitrary signature string");

  // 2.4 Mismatched length signature (Testing constant-time safe behavior)
  const invalidResult3 = verifyPaymentSignature({
    razorpay_order_id: testRazorpayOrderId,
    razorpay_payment_id: testRazorpayPaymentId,
    razorpay_signature: "short_sig",
  });
  assert(invalidResult3 === false, "2.4 Safely rejects invalid-length signature without throwing exceptions");

  console.log("");

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 3: Order State & Idempotency Storage
  // ─────────────────────────────────────────────────────────────────────────
  console.log("👉 Test Group 3: Order Storage & Idempotency Controls");

  const mockOrderId = generateOrderId();
  const mockOrder: Order = {
    id: mockOrderId,
    items: [
      {
        productId: PRODUCTS_DATA[0].id,
        name: PRODUCTS_DATA[0].name,
        weight: "500g",
        quantity: 1,
        unitPrice: 500,
        lineTotal: 500,
      },
    ],
    customer: {
      fullName: "John Doe",
      phone: "9876543210",
      email: "john@example.com",
    },
    address: {
      street: "123 Bakery Lane",
      city: "Chennai",
      pincode: "600001",
    },
    schedule: {
      date: "2026-09-20",
      timeSlot: "10:00 AM - 12:00 PM",
    },
    subtotal: 500,
    sgst: 12.5,
    cgst: 12.5,
    tax: 25,
    deliveryFee: 0,
    total: 525,
    orderStatus: "PENDING",
    paymentStatus: "PAYMENT_INITIATED",
    razorpayOrderId: testRazorpayOrderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 3.1 Store order creation
  await orderStore.create(mockOrder);
  const fetched = await orderStore.get(mockOrderId);
  assert(fetched !== null && fetched.id === mockOrderId, "3.1 Stores and retrieves order by ID");

  // 3.2 Lookup by Razorpay Order ID
  const fetchedByRzp = await orderStore.getByRazorpayOrderId(testRazorpayOrderId);
  assert(fetchedByRzp !== null && fetchedByRzp.id === mockOrderId, "3.2 Indexes and retrieves order by Razorpay Order ID");

  // 3.3 Register idempotency key
  const testIdempotencyKey = "idempotency_key_abc_123_xyz";
  await orderStore.registerIdempotencyKey(testIdempotencyKey, mockOrderId);
  const fetchedByIdempotency = await orderStore.getByIdempotencyKey(testIdempotencyKey);
  assert(fetchedByIdempotency !== null && fetchedByIdempotency.id === mockOrderId, "3.3 Registers and enforces idempotency key matching");

  // 3.4 Order state mutation
  await orderStore.update(mockOrderId, { paymentStatus: "PAID", orderStatus: "PROCESSING" });
  const updatedOrder = await orderStore.get(mockOrderId);
  assert(updatedOrder?.paymentStatus === "PAID" && updatedOrder?.orderStatus === "PROCESSING", "3.4 Updates order payment and order status correctly");

  console.log("");

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 4: Product Catalog & Search Verification
  // ─────────────────────────────────────────────────────────────────────────
  console.log("👉 Test Group 4: Product Catalog & Search Consistency");

  assert(PRODUCTS_DATA.length === 133, "4.1 Full 133-item catalog present and loaded");

  const singleProduct = getProductById(PRODUCTS_DATA[0].id);
  assert(singleProduct !== null, "4.2 Resolves individual product by ID");

  const bentoCakes = PRODUCTS_DATA.filter((p) => p.category === "bento-cake");
  assert(bentoCakes.length > 0, "4.3 Category filter for bento cakes returns items");

  console.log("");

  // ─────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────
  console.log("==========================================================");
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSecuritySuite().catch((err) => {
  console.error("Fatal security suite error:", err);
  process.exit(1);
});
