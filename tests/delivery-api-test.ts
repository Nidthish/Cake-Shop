import { orderStore, generateOrderId, getOrGenerateDeliveryOtp, verifyAndDeliverOrder, cancelDeliveryOrder } from "../lib/orders";
import type { Order } from "../types";

async function runDeliveryTests() {
  console.log("==========================================================");
  console.log("🛵 LOLLIPOP DELIVERY APP & APIS TEST SUITE");
  console.log("==========================================================\n");

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

  // 1. Create a test order
  const testOrderId = generateOrderId();
  const mockOrder: Order = {
    id: testOrderId,
    items: [
      {
        productId: "LLP-PRD-01",
        name: "Chocolate Truffle Cake",
        weight: "1kg",
        quantity: 1,
        unitPrice: 750,
        lineTotal: 750,
        eggPreference: "eggless",
        cakeMessage: "Happy Birthday Arjun",
      },
      {
        productId: "LLP-PRD-02",
        name: "Red Velvet Pastry",
        weight: "500g",
        quantity: 2,
        unitPrice: 150,
        lineTotal: 300,
        eggPreference: "egg",
      },
    ],
    customer: {
      fullName: "Priya Sundaram",
      email: "priya.test@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      street: "14B, Royal Enclave, Thillai Nagar",
      city: "Tiruchirappalli",
      pincode: "620018",
    },
    schedule: {
      date: new Date().toISOString().split("T")[0],
      timeSlot: "11:00 AM - 02:00 PM",
    },
    subtotal: 1050,
    sgst: 26.25,
    cgst: 26.25,
    tax: 52.5,
    deliveryFee: 40,
    total: 1142.5,
    orderStatus: "CONFIRMED",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    specialInstructions: "Ring bell twice, flat is on 2nd floor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await orderStore.create(mockOrder);
  console.log(`📦 Order created: ${testOrderId}`);

  // 2. Fetch order
  const fetched = await orderStore.get(testOrderId);
  assert(fetched !== null && fetched.id === testOrderId, "1. Fetch order details for delivery partner");
  assert(fetched?.items.length === 2, "2. Order items loaded accurately");
  assert(fetched?.customer.fullName === "Priya Sundaram", "3. Customer info correct");

  // 3. Mark Out for Delivery & generate OTP
  await orderStore.update(testOrderId, {
    orderStatus: "OUT_FOR_DELIVERY",
    deliveryPartnerName: "Karthik Raja",
    deliveryPartnerPhone: "+91 91234 56789",
  });
  const otpRes = await getOrGenerateDeliveryOtp(testOrderId);
  assert(otpRes !== null && otpRes.otp.length === 4, `4. Generate 4-digit OTP (${otpRes?.otp})`);

  // 4. Verify invalid OTP rejection
  const badDelivery = await verifyAndDeliverOrder(testOrderId, {
    otp: "0000",
    partnerName: "Karthik Raja",
  });
  assert(badDelivery.success === false, "5. Reject invalid OTP upon delivery attempt");

  // 5. Verify valid OTP & confirm delivery
  const goodDelivery = await verifyAndDeliverOrder(testOrderId, {
    otp: otpRes!.otp,
    partnerName: "Karthik Raja",
    partnerPhone: "+91 91234 56789",
  });
  assert(goodDelivery.success === true, "6. Successfully confirm delivery with valid OTP");
  assert(goodDelivery.order?.orderStatus === "DELIVERED", "7. Order status changed to DELIVERED");
  assert(goodDelivery.order?.deliveryOtpVerified === true, "8. Delivery OTP marked verified");
  assert(goodDelivery.order?.paymentStatus === "PAID", "9. COD payment automatically updated to PAID on delivery");

  // 6. Test cancellation flow on a second order
  const cancelTestId = generateOrderId();
  const cancelOrderMock: Order = {
    ...mockOrder,
    id: cancelTestId,
    orderStatus: "OUT_FOR_DELIVERY",
  };
  await orderStore.create(cancelOrderMock);
  const cancelRes = await cancelDeliveryOrder(cancelTestId, "Customer doorstep rejection - cancelled by user", "Karthik Raja");
  assert(cancelRes.success === true, "10. Successfully cancel delivery with audit reason");
  assert(cancelRes.order?.orderStatus === "CANCELLED", "11. Order status marked CANCELLED");
  assert(Boolean(cancelRes.order?.cancellationReason?.includes("doorstep rejection")), "12. Cancellation reason stored properly");

  console.log("\n==========================================================");
  console.log(`📊 DELIVERY TEST SUITE: ${passed} PASSED | ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) process.exit(1);
}

runDeliveryTests()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Test error:", e);
    process.exit(1);
  });
