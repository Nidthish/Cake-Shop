import type { Order } from "@/types";

/**
 * Generate a luxury, printable Tax Invoice HTML for Lollipop Cake Shop
 */
export function generateInvoiceHtml(order: Order, options: { autoPrint?: boolean } = {}): string {
  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDeliveryDate = new Date(order.schedule.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const paymentModeLabel =
    order.paymentMethod === "COD"
      ? "Cash on Delivery (Pay to Delivery Partner)"
      : order.paymentMethod === "DIRECT"
      ? "Direct Bakery Order"
      : "Prepaid Online (Razorpay / UPI / Card)";

  const isPaid = order.paymentStatus === "PAID";

  const itemsRows = order.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #F1E6DF;">
        <td style="padding: 12px 10px; text-align: center; color: #5C524E; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 12px 10px; color: #1C0D0A;">
          <div style="font-weight: 700; font-size: 14px; color: #802B52;">${item.name}</div>
          <div style="font-size: 12px; color: #7A6B72; margin-top: 2px;">
            Variant: <strong>${item.weight}</strong>
            ${item.eggPreference ? ` &bull; <span style="font-weight: 600; color: ${item.eggPreference === "eggless" ? "#2E7D32" : "#D97706"};">${item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 With Egg"}</span>` : ""}
          </div>
          ${item.cakeMessage ? `<div style="font-size: 11px; color: #802B52; font-style: italic; margin-top: 3px;">🎂 Custom Message: "${item.cakeMessage}"</div>` : ""}
        </td>
        <td style="padding: 12px 10px; text-align: center; font-weight: 700; color: #1C0D0A; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px 10px; text-align: right; color: #5C524E; font-size: 13px;">₹${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 12px 10px; text-align: right; font-weight: 700; color: #802B52; font-size: 14px;">₹${item.lineTotal.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tax Invoice - ${order.id} | Lollipop Cake Shop</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #FAF5EE;
      color: #1C0D0A;
      line-height: 1.5;
      padding: 24px 12px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E6DBCE;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(128, 43, 82, 0.08);
      overflow: hidden;
    }
    .top-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: #250527;
      color: #FFFFFF;
    }
    .top-actions a, .top-actions button {
      background: #D4AF37;
      color: #250527;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }
    .top-actions a:hover, .top-actions button:hover { opacity: 0.9; }
    .header-band {
      background: linear-gradient(135deg, #250527 0%, #4A0E4E 100%);
      color: #FFFFFF;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 20px;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      font-family: Georgia, serif;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #E6C184;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      margin-top: 4px;
    }
    .brand-contact {
      font-size: 12px;
      color: #F1E6DF;
      margin-top: 8px;
      line-height: 1.5;
    }
    .invoice-badge-box {
      text-align: right;
    }
    .invoice-badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.2);
      border: 1px solid #D4AF37;
      color: #E6C184;
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: monospace;
    }
    .invoice-dates {
      font-size: 12px;
      color: #F1E6DF;
      margin-top: 4px;
    }
    .body-content {
      padding: 32px 36px;
    }
    .otp-card {
      background: #FFFDF8;
      border: 2px dashed #D4AF37;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      margin-bottom: 28px;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.12);
    }
    .otp-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #802B52;
      letter-spacing: 2px;
    }
    .otp-code {
      font-size: 40px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #250527;
      font-family: 'Courier New', Courier, monospace;
      margin: 6px 0;
    }
    .otp-note {
      font-size: 12px;
      color: #5C524E;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
    }
    @media (max-width: 600px) {
      .details-grid { grid-template-columns: 1fr; }
    }
    .info-card {
      background: #FAF5EE;
      border: 1px solid #E6DBCE;
      border-radius: 14px;
      padding: 18px;
      font-size: 13px;
    }
    .info-card-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #802B52;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: block;
      border-bottom: 1px solid #E6DBCE;
      padding-bottom: 6px;
    }
    .info-line {
      margin-bottom: 5px;
      color: #1C0D0A;
      display: flex;
      justify-content: space-between;
    }
    .info-line strong { color: #5C524E; font-weight: 600; }
    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
    }
    .status-paid { background: #E8F5E9; color: #2E7D32; }
    .status-pending { background: #FFF3E0; color: #E65100; }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #E6DBCE;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .items-table th {
      background: #802B52;
      color: #FFFFFF;
      padding: 12px 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .breakdown-table {
      width: 100%;
      max-width: 340px;
      margin-left: auto;
      border-collapse: collapse;
      background: #FAF5EE;
      border: 1px solid #E6DBCE;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 30px;
    }
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 16px;
      font-size: 13px;
      color: #5C524E;
    }
    .breakdown-row.total {
      border-top: 1px solid #E6DBCE;
      padding-top: 10px;
      margin-top: 6px;
      font-size: 16px;
      font-weight: 800;
      color: #802B52;
    }
    .footer-band {
      background: #1C0D0A;
      color: #D8C3B3;
      padding: 24px 36px;
      text-align: center;
      font-size: 12px;
    }
    .footer-band strong { color: #FFFFFF; }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .invoice-wrapper { box-shadow: none; border: none; max-width: 100%; }
      .top-actions { display: none !important; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body>

  <div class="invoice-wrapper">
    <!-- Top Action Bar (hidden in print) -->
    <div class="top-actions">
      <span style="font-size: 13px; font-weight: 600;">Lollipop Cake Shop &bull; Official Tax Invoice</span>
      <div style="display: flex; gap: 10px;">
        <button onclick="window.print()">
          <span>🖨️</span> Print / Save as PDF
        </button>
      </div>
    </div>

    <!-- Header Band -->
    <div class="header-band">
      <div>
        <div class="brand-title">Lollipop Cake Shop</div>
        <div class="brand-subtitle">Artisanal Patisserie &amp; Bakery</div>
        <div class="brand-contact">
          Tiruchirappalli, Tamil Nadu &bull; Pin: 620001<br />
          Helpline / WhatsApp: +91 9489569661<br />
          Website: https://lollipop-kart.vercel.app
        </div>
      </div>
      <div class="invoice-badge-box">
        <div class="invoice-badge">Tax Invoice</div>
        <div class="invoice-number">${order.id}</div>
        <div class="invoice-dates">
          Date: ${formattedOrderDate}<br />
          Status: <strong>${order.orderStatus}</strong>
        </div>
      </div>
    </div>

    <div class="body-content">
      <!-- Prominent Delivery OTP Box -->
      <div class="otp-card">
        <div class="otp-label">🔐 Delivery Verification OTP</div>
        <div class="otp-code">${order.deliveryOtp || "----"}</div>
        <div class="otp-note">
          Please present this <strong>4-digit security code</strong> to your delivery partner upon cake handoff to verify receipt.
          ${order.deliveryOtpVerified ? "<br /><span style='color: #2E7D32; font-weight: bold;'>✅ This OTP has been successfully verified upon delivery.</span>" : ""}
        </div>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">
        <!-- Customer & Delivery -->
        <div class="info-card">
          <span class="info-card-title">📍 Delivery Destination &amp; Recipient</span>
          <div class="info-line"><strong>Recipient:</strong> <span>${order.customer.fullName}</span></div>
          <div class="info-line"><strong>Phone:</strong> <span>${order.customer.phone}</span></div>
          <div class="info-line"><strong>Email:</strong> <span>${order.customer.email}</span></div>
          <div class="info-line"><strong>Address:</strong> <span>${order.address.street}, ${order.address.city} - ${order.address.pincode}</span></div>
          <div class="info-line" style="margin-top: 8px; border-top: 1px dashed #E6DBCE; padding-top: 6px;">
            <strong>Scheduled Delivery:</strong> <span style="font-weight: 700; color: #802B52;">${formattedDeliveryDate} (${order.schedule.timeSlot})</span>
          </div>
        </div>

        <!-- Payment & Order Info -->
        <div class="info-card">
          <span class="info-card-title">💳 Payment &amp; Billing Details</span>
          <div class="info-line"><strong>Payment Mode:</strong> <span>${paymentModeLabel}</span></div>
          <div class="info-line">
            <strong>Payment Status:</strong> 
            <span class="status-pill ${isPaid ? "status-paid" : "status-pending"}">${order.paymentStatus}</span>
          </div>
          ${order.razorpayPaymentId ? `<div class="info-line"><strong>Razorpay Payment ID:</strong> <span style="font-family: monospace; font-size: 11px;">${order.razorpayPaymentId}</span></div>` : ""}
          ${order.razorpayOrderId ? `<div class="info-line"><strong>Razorpay Order ID:</strong> <span style="font-family: monospace; font-size: 11px;">${order.razorpayOrderId}</span></div>` : ""}
          <div class="info-line" style="margin-top: 8px; border-top: 1px dashed #E6DBCE; padding-top: 6px;">
            <strong>Amount Payable / Paid:</strong> <span style="font-weight: 800; font-size: 15px; color: #802B52;">₹${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${order.cakeMessage || order.specialInstructions ? `
      <!-- Cake Notes -->
      <div style="background: #FFF8E7; border: 1px solid #E6C184; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px;">
        ${order.cakeMessage ? `<div style="color: #802B52; font-weight: 600;">🎂 Message on Cake: "${order.cakeMessage}"</div>` : ""}
        ${order.specialInstructions ? `<div style="color: #5C524E; margin-top: 4px;">📝 Baker Instructions: ${order.specialInstructions}</div>` : ""}
      </div>
      ` : ""}

      <!-- Itemized Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th style="text-align: left;">Item Description</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 100px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Price Breakdown -->
      <div class="breakdown-table">
        <div class="breakdown-row">
          <span>Items Subtotal:</span>
          <strong>₹${order.subtotal.toFixed(2)}</strong>
        </div>
        <div class="breakdown-row">
          <span>SGST (2.5%):</span>
          <span>₹${order.sgst.toFixed(2)}</span>
        </div>
        <div class="breakdown-row">
          <span>CGST (2.5%):</span>
          <span>₹${order.cgst.toFixed(2)}</span>
        </div>
        <div class="breakdown-row">
          <span>Delivery Charges:</span>
          <span style="color: #2E7D32; font-weight: 700;">${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee.toFixed(2)}`}</span>
        </div>
        <div class="breakdown-row total">
          <span>Grand Total:</span>
          <span>₹${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="font-size: 11px; color: #7A6B72; text-align: center; margin-top: 10px;">
        This is a computer-generated tax invoice issued by Lollipop Cake Shop. No physical signature is required.
      </div>
    </div>

    <!-- Footer Band -->
    <div class="footer-band">
      <p style="margin-bottom: 4px;"><strong>Lollipop Cake Shop</strong> &bull; Handcrafted Fresh Daily with Pure Ingredients</p>
      <p>Thank you for celebrating your precious moments with us! For help, contact WhatsApp: <strong>+91 9489569661</strong></p>
    </div>
  </div>

  ${options.autoPrint ? "<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>" : ""}
</body>
</html>`;
}
