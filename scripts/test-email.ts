import { sendOrderConfirmationEmail } from "../lib/email";
import type { Order } from "../types";

async function testEmail() {
  console.log("🚀 Testing Order Confirmation Receipt & Invoice Email Generation...");

  const mockOrder: Order = {
    id: "LOL-987654-TEST",
    items: [
      {
        productId: "belgian-chocolate-truffle",
        name: "Belgian Chocolate Truffle Cake",
        weight: "1 kg",
        quantity: 1,
        unitPrice: 750,
        lineTotal: 750,
      },
      {
        productId: "korean-bento-mini-cake",
        name: "Korean Bento Box Lunchbox Cake",
        weight: "300g",
        quantity: 2,
        unitPrice: 350,
        lineTotal: 700,
      },
    ],
    customer: {
      fullName: "Ananya Patel",
      email: "ananya.patel@example.com",
      phone: "9876543210",
    },
    address: {
      street: "Flat 402, Royal Palms, MG Road",
      city: "Chennai",
      pincode: "600001",
    },
    schedule: {
      date: "2026-09-28",
      timeSlot: "04:00 PM - 06:00 PM",
    },
    subtotal: 1450,
    sgst: 36.25,
    cgst: 36.25,
    tax: 72.50,
    deliveryFee: 0,
    total: 1522.50,
    orderStatus: "PROCESSING",
    paymentStatus: "PAID",
    razorpayOrderId: "order_Kx9823hZks9123",
    razorpayPaymentId: "pay_Kx9824mPqs8412",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await sendOrderConfirmationEmail(mockOrder);
  console.log("✨ Test Email Execution Result:", result);
}

testEmail().catch((err) => {
  console.error("❌ Test Email Failed:", err);
});
