import { jsPDF } from "jspdf";
import type { Order } from "@/types";

/**
 * Generate a clean, professional, Black & White printable Tax Invoice HTML for Lollipop Cake Shop
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
      ? "Cash on Delivery"
      : order.paymentMethod === "DIRECT"
      ? "Direct Bakery Order"
      : "Prepaid Online (Razorpay / UPI / Card)";

  const isPaid = order.paymentStatus === "PAID";

  const itemsRows = order.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #E5E7EB; ${idx % 2 === 1 ? "background-color: #F9FAFB;" : ""}">
        <td style="padding: 10px 8px; text-align: center; color: #4B5563; font-size: 12px;">${idx + 1}</td>
        <td style="padding: 10px 8px; color: #111827;">
          <div style="font-weight: 700; font-size: 13px; color: #111827;">${item.name}</div>
        </td>
        <td style="padding: 10px 8px; color: #374151; font-size: 12px;">
          ${item.weight} ${item.eggPreference === "eggless" ? "[Eggless]" : "[With Egg]"}
        </td>
        <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #111827; font-size: 12px;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; color: #374151; font-size: 12px;">Rs. ${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 700; color: #111827; font-size: 13px;">Rs. ${item.lineTotal.toFixed(2)}</td>
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
      background-color: #FFFFFF;
      color: #111827;
      line-height: 1.5;
      padding: 24px 12px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #111827;
      border-radius: 8px;
      overflow: hidden;
    }
    .top-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background: #111827;
      color: #FFFFFF;
    }
    .top-actions a, .top-actions button {
      background: #FFFFFF;
      color: #111827;
      border: 1px solid #FFFFFF;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .top-actions a:hover, .top-actions button:hover { opacity: 0.9; }
    .header-band {
      background: #FFFFFF;
      color: #111827;
      padding: 24px 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #111827;
      gap: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #111827;
      font-family: Georgia, serif;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #4B5563;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      margin-top: 3px;
    }
    .brand-contact {
      font-size: 11px;
      color: #4B5563;
      margin-top: 6px;
      line-height: 1.4;
    }
    .invoice-badge-box {
      text-align: right;
    }
    .invoice-badge {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .invoice-number {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-top: 4px;
    }
    .invoice-dates {
      font-size: 11px;
      color: #4B5563;
      margin-top: 4px;
      line-height: 1.4;
    }
    .body-content {
      padding: 20px 24px;
    }
    .otp-card {
      background: #FFFFFF;
      border: 1px solid #111827;
      border-radius: 6px;
      padding: 10px 16px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #111827;
    }
    .otp-code {
      font-family: monospace;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #111827;
    }
    .otp-note {
      font-size: 11px;
      color: #4B5563;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    @media (max-width: 640px) {
      .details-grid { grid-template-columns: 1fr; }
    }
    .info-card {
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      padding: 14px 16px;
    }
    .info-card-title {
      display: block;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #111827;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-line {
      font-size: 12px;
      color: #374151;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border: 1px solid #111827;
    }
    .items-table th {
      background: #111827;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      border: 1px solid #111827;
    }
    .bottom-layout {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 640px) {
      .bottom-layout { grid-template-columns: 1fr; }
    }
    .terms-box {
      border: 1px solid #111827;
      border-radius: 6px;
      padding: 12px 14px;
      background: #FFFFFF;
    }
    .terms-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #111827;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid #E5E7EB;
    }
    .terms-text {
      font-size: 10px;
      color: #374151;
      line-height: 1.45;
    }
    .terms-text ol {
      padding-left: 14px;
    }
    .terms-text li {
      margin-bottom: 4px;
    }
    .breakdown-table {
      border: 1px solid #111827;
      border-radius: 6px;
      padding: 12px 16px;
      background: #FFFFFF;
    }
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #374151;
      margin-bottom: 6px;
    }
    .breakdown-row.total {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #111827;
      font-size: 14px;
      font-weight: 800;
      color: #111827;
    }
    .footer-band {
      border-top: 1px solid #E5E7EB;
      padding: 12px 24px;
      text-align: center;
      font-size: 10.5px;
      color: #6B7280;
    }
    @media print {
      body { padding: 0; background: #FFF; }
      .top-actions { display: none !important; }
      .invoice-wrapper { border: none; box-shadow: none; max-width: 100%; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="top-actions">
      <div><strong>Tax Invoice:</strong> ${order.id}</div>
      <div style="display: flex; gap: 8px;">
        <a href="/api/orders/${order.id}/invoice?download=1">
          <span>⬇️</span> Download PDF
        </a>
        <button onclick="window.print()">
          <span>🖨️</span> Print Invoice
        </button>
      </div>
    </div>

    <!-- Header Band (Black & White) -->
    <div class="header-band">
      <div>
        <div class="brand-title">Lollipop Cake Shop</div>
        <div class="brand-subtitle">Artisanal Patisserie &amp; Celebration Bakery</div>
        <div class="brand-contact">
          Tiruchirappalli, Tamil Nadu &bull; Pin: 620001<br />
          Helpline / WhatsApp: +91 9489569661<br />
          Website: https://lollipop-kart.vercel.app &bull; FSSAI Lic: 22423000000000
        </div>
      </div>
      <div class="invoice-badge-box">
        <div class="invoice-badge">TAX INVOICE</div>
        <div class="invoice-number">Invoice No: ${order.id}</div>
        <div class="invoice-dates">
          Date: ${formattedOrderDate}<br />
          Status: <strong>${(order.orderStatus || "CONFIRMED").replace(/_/g, " ")}</strong>
        </div>
      </div>
    </div>

    <div class="body-content">
      <!-- Delivery Verification OTP Box -->
      <div class="otp-card">
        <div>
          <div class="otp-label">Delivery Verification OTP</div>
          <div class="otp-code">${order.deliveryOtp || "----"}</div>
        </div>
        <div class="otp-note">
          Share this <strong>4-digit code</strong> with your delivery partner upon arrival to confirm handoff.
          ${order.deliveryOtpVerified ? "<br /><strong>[VERIFIED &amp; CONFIRMED]</strong>" : ""}
        </div>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">
        <div class="info-card">
          <span class="info-card-title">Billed &amp; Delivered To</span>
          <div class="info-line"><span>Recipient:</span> <strong>${order.customer?.fullName || "Customer"}</strong></div>
          <div class="info-line"><span>Phone:</span> <strong>${order.customer?.phone || "-"}</strong></div>
          <div class="info-line"><span>Email:</span> <strong>${order.customer?.email || "-"}</strong></div>
          <div class="info-line"><span>Address:</span> <span>${order.address?.street || ""}, ${order.address?.city || ""} - ${order.address?.pincode || ""}</span></div>
        </div>

        <div class="info-card">
          <span class="info-card-title">Order &amp; Payment Information</span>
          <div class="info-line"><span>Delivery Date:</span> <strong>${formattedDeliveryDate} (${order.schedule?.timeSlot || "Scheduled"})</strong></div>
          <div class="info-line"><span>Payment Mode:</span> <strong>${paymentModeLabel}</strong></div>
          <div class="info-line"><span>Payment Status:</span> <strong>${order.paymentStatus || "PENDING"}</strong></div>
          ${order.deliveryPartnerName ? `<div class="info-line"><span>Delivered by:</span> <strong>${order.deliveryPartnerName}</strong></div>` : ""}
          ${order.razorpayPaymentId ? `<div class="info-line"><span>Transaction ID:</span> <code>${order.razorpayPaymentId}</code></div>` : ""}
        </div>
      </div>

      <!-- Itemized Table (Message removed, perfectly aligned) -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 36px; text-align: center;">#</th>
            <th style="text-align: left;">Item Description</th>
            <th style="width: 140px; text-align: left;">Variant / Preference</th>
            <th style="width: 50px; text-align: center;">Qty</th>
            <th style="width: 90px; text-align: right;">Rate (INR)</th>
            <th style="width: 90px; text-align: right;">Total (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Bottom Layout: Terms & Conditions + Refund Policy & Price Breakdown -->
      <div class="bottom-layout">
        <div class="terms-box">
          <div class="terms-title">Terms, Conditions &amp; Refund Policy</div>
          <div class="terms-text">
            <ol>
              <li>This is a computer-generated tax invoice and requires no physical signature.</li>
              <li>Handcrafted fresh to order using 100% pure food-grade ingredients.</li>
              <li>Storage: Refrigerate below 4°C immediately upon receipt and consume within 24 hours.</li>
              <li><strong>Refund &amp; Replacement Policy:</strong> As all products are freshly prepared perishable food items, returns are not accepted after handoff. If you experience transit damage or quality concerns, notify via WhatsApp (+91 9489569661) within 2 hours of delivery for an immediate replacement or full refund.</li>
              <li>For support, contact Helpline / WhatsApp: +91 9489569661 quoting your Order ID.</li>
            </ol>
          </div>
        </div>

        <div class="breakdown-table">
          <div class="breakdown-row">
            <span>Items Subtotal:</span>
            <strong>Rs. ${(order.subtotal || 0).toFixed(2)}</strong>
          </div>
          <div class="breakdown-row">
            <span>SGST (2.5%):</span>
            <span>Rs. ${(order.sgst || 0).toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span>CGST (2.5%):</span>
            <span>Rs. ${(order.cgst || 0).toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span>Delivery Charges:</span>
            <strong>${(order.deliveryFee || 0) === 0 ? "FREE" : `Rs. ${(order.deliveryFee || 0).toFixed(2)}`}</strong>
          </div>
          <div class="breakdown-row total">
            <span>Grand Total:</span>
            <span>Rs. ${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Band -->
    <div class="footer-band">
      <p style="margin-bottom: 2px;"><strong>Lollipop Cake Shop</strong> &bull; Handcrafted Fresh Daily with Pure Ingredients &bull; Tiruchirappalli, Tamil Nadu</p>
      <p>Thank you for celebrating with us! Helpline / WhatsApp: <strong>+91 9489569661</strong></p>
    </div>
  </div>

  ${options.autoPrint ? "<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>" : ""}
</body>
</html>`;
}

/**
 * Generate a clean, professional, Black & White PDF Tax Invoice for Lollipop Cake Shop
 */
export function generateInvoicePdf(order: Order): Uint8Array {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 523.28 pt

  let y = 30;

  // 1. Header (Black & White Professional Style)
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("LOLLIPOP CAKE SHOP", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text("ARTISANAL PATISSERIE & CELEBRATION BAKERY", margin, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("Tiruchirappalli, Tamil Nadu  |  Helpline / WhatsApp: +91 9489569661", margin, y + 25);
  doc.text("Website: https://lollipop-kart.vercel.app  |  FSSAI Lic: 22423000000000", margin, y + 36);

  // Right Side: TAX INVOICE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("TAX INVOICE", pageWidth - margin, y, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice No: ${order.id}`, pageWidth - margin, y + 14, { align: "right" });

  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${formattedOrderDate}`, pageWidth - margin, y + 25, { align: "right" });
  doc.text(`Status: ${(order.orderStatus || "CONFIRMED").replace(/_/g, " ")}`, pageWidth - margin, y + 36, { align: "right" });

  // Divider Rule
  y += 44;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // 2. Delivery Verification OTP Box (Black & White)
  const otpCardHeight = 40;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, otpCardHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("DELIVERY VERIFICATION OTP", margin + 12, y + 15);

  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(order.deliveryOtp || "----", margin + 12, y + 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  const otpNote = order.deliveryOtpVerified
    ? "Status: Verified & Confirmed upon Delivery."
    : "Share this 4-digit code with your delivery partner upon arrival to confirm handoff.";
  doc.text(otpNote, margin + 78, y + 23);

  if (order.deliveryOtpVerified) {
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("[VERIFIED]", pageWidth - margin - 12, y + 23, { align: "right" });
  }

  y += otpCardHeight + 10;

  // 3. Customer & Order Details Cards (Side-by-side, Black & White)
  const cardWidth = (contentWidth - 10) / 2;
  const cardHeight = 94;

  // Card A: Customer Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("BILLED & DELIVERED TO", margin + 10, y + 15);

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin + 10, y + 20, margin + cardWidth - 10, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(order.customer?.fullName || "Customer", margin + 10, y + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Phone: ${order.customer?.phone || "-"}`, margin + 10, y + 44);
  doc.text(`Email: ${order.customer?.email || "-"}`, margin + 10, y + 55);

  const addressStr = `${order.address?.street || ""}, ${order.address?.city || ""} - ${order.address?.pincode || ""}`;
  const splitAddress = doc.splitTextToSize(addressStr, cardWidth - 20);
  doc.text(splitAddress, margin + 10, y + 67);

  // Card B: Order & Payment Details
  doc.roundedRect(margin + cardWidth + 10, y, cardWidth, cardHeight, 4, 4, "FD");

  const cardBX = margin + cardWidth + 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("ORDER & PAYMENT INFORMATION", cardBX, y + 15);

  doc.line(cardBX - 10, y + 20, margin + contentWidth - 10, y + 20);

  const deliveryScheduleDate = order.schedule?.date
    ? new Date(order.schedule.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text("Delivery Date:", cardBX, y + 32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${deliveryScheduleDate} (${order.schedule?.timeSlot || "Scheduled"})`, cardBX + 62, y + 32);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text("Payment Mode:", cardBX, y + 44);
  const paymentModeText =
    order.paymentMethod === "COD"
      ? "Cash on Delivery"
      : order.paymentMethod === "DIRECT"
      ? "Direct Bakery Order"
      : "Prepaid Online (Razorpay / UPI)";
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(paymentModeText, cardBX + 62, y + 44);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text("Payment Status:", cardBX, y + 56);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(order.paymentStatus || "PENDING", cardBX + 62, y + 56);

  if (order.deliveryPartnerName) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text("Delivered by:", cardBX, y + 68);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${order.deliveryPartnerName} ${order.deliveryPartnerPhone ? `(${order.deliveryPartnerPhone})` : ""}`, cardBX + 62, y + 68);
  } else if (order.razorpayPaymentId) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text("Transaction ID:", cardBX, y + 68);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(order.razorpayPaymentId, cardBX + 62, y + 68);
  }

  y += cardHeight + 12;

  // 4. Items Table (Cake messages omitted as requested, perfectly aligned)
  const colIdx = margin + 14;
  const colName = margin + 30;
  const colVariant = margin + 225;
  const colQty = margin + 360;
  const colRate = margin + 440;
  const colTotal = pageWidth - margin - 10;

  const tableHeaderHeight = 20;
  doc.setFillColor(0, 0, 0); // Solid Black header bar
  doc.rect(margin, y, contentWidth, tableHeaderHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("#", colIdx, y + 13, { align: "center" });
  doc.text("ITEM DESCRIPTION", colName, y + 13);
  doc.text("VARIANT / PREFERENCE", colVariant, y + 13);
  doc.text("QTY", colQty, y + 13, { align: "center" });
  doc.text("RATE (INR)", colRate, y + 13, { align: "right" });
  doc.text("TOTAL (INR)", colTotal, y + 13, { align: "right" });

  y += tableHeaderHeight;

  // 5. Items Rows
  const items = order.items || [];
  let tableTotalHeight = 0;
  const rowHeight = 20;

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;

    // Check page overflow
    if (y + rowHeight > pageHeight - 160) {
      doc.addPage();
      y = margin;
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, y, contentWidth, tableHeaderHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("#", colIdx, y + 13, { align: "center" });
      doc.text("ITEM DESCRIPTION (CONT.)", colName, y + 13);
      doc.text("VARIANT / PREFERENCE", colVariant, y + 13);
      doc.text("QTY", colQty, y + 13, { align: "center" });
      doc.text("RATE (INR)", colRate, y + 13, { align: "right" });
      doc.text("TOTAL (INR)", colTotal, y + 13, { align: "right" });
      y += tableHeaderHeight;
    }

    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 248, 248);
    }
    doc.rect(margin, y, contentWidth, rowHeight, "F");

    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.5);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    // Number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(String(index + 1), colIdx, y + 13, { align: "center" });

    // Item Name (No custom message string)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(item.name || "Item", colName, y + 13);

    // Variant & Egg Tag
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    const eggTag = item.isEggless || item.eggPreference === "eggless" ? "[Eggless]" : "[With Egg]";
    doc.text(`${item.weight || ""} ${eggTag}`, colVariant, y + 13);

    // Quantity
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(String(item.quantity || 1), colQty, y + 13, { align: "center" });

    // Rate
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(`Rs. ${(item.unitPrice || 0).toFixed(2)}`, colRate, y + 13, { align: "right" });

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${(item.lineTotal || 0).toFixed(2)}`, colTotal, y + 13, { align: "right" });

    y += rowHeight;
    tableTotalHeight += rowHeight;
  });

  // Table Outer Border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, y - tableHeaderHeight - tableTotalHeight, contentWidth, tableHeaderHeight + tableTotalHeight, "S");

  y += 12;

  // 6. Summary Breakdown Box (Right) & Terms & Conditions + Refund Policy Box (Left)
  const summaryWidth = 215;
  const summaryX = pageWidth - margin - summaryWidth;
  const summaryHeight = 96;

  // Summary Box (Right)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.roundedRect(summaryX, y, summaryWidth, summaryHeight, 4, 4, "FD");

  const sumLine = (label: string, value: string, curY: number, isBold = false) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(isBold ? 9.5 : 8);
    doc.setTextColor(0, 0, 0);
    doc.text(label, summaryX + 12, curY);
    doc.text(value, summaryX + summaryWidth - 12, curY, { align: "right" });
  };

  sumLine("Items Subtotal:", `Rs. ${(order.subtotal || 0).toFixed(2)}`, y + 16);
  sumLine("SGST (2.5%):", `Rs. ${(order.sgst || 0).toFixed(2)}`, y + 30);
  sumLine("CGST (2.5%):", `Rs. ${(order.cgst || 0).toFixed(2)}`, y + 44);
  sumLine("Delivery Charges:", (order.deliveryFee || 0) === 0 ? "FREE" : `Rs. ${(order.deliveryFee || 0).toFixed(2)}`, y + 58);

  // Total Divider line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.75);
  doc.line(summaryX + 10, y + 68, summaryX + summaryWidth - 10, y + 68);

  // Grand Total Line (Black)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Grand Total:", summaryX + 12, y + 84);
  doc.text(`Rs. ${(order.total || 0).toFixed(2)}`, summaryX + summaryWidth - 12, y + 84, { align: "right" });

  // Terms, Conditions & Refund Policy Box (Left)
  const noteX = margin;
  const noteWidth = contentWidth - summaryWidth - 12;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.roundedRect(noteX, y, noteWidth, summaryHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("TERMS, CONDITIONS & REFUND POLICY", noteX + 10, y + 14);

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(noteX + 10, y + 18, noteX + noteWidth - 10, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);

  const notesText = [
    "1. Computer-generated tax invoice; requires no physical signature.",
    "2. Handcrafted fresh to order using 100% pure food-grade ingredients.",
    "3. Storage: Refrigerate below 4C upon receipt; consume within 24 hours.",
    "4. Refund Policy: As bakery items are perishable, returns are not accepted after handoff. For damaged delivery or quality issues, notify via WhatsApp within 2 hours of delivery for an immediate replacement or full refund.",
    "5. For support, contact Helpline / WhatsApp: +91 9489569661 with Order ID.",
  ];

  let noteY = y + 27;
  notesText.forEach((t) => {
    const wrappedT = doc.splitTextToSize(t, noteWidth - 20);
    doc.text(wrappedT, noteX + 10, noteY);
    noteY += Array.isArray(wrappedT) ? wrappedT.length * 9 : 9;
  });

  // 7. Footer Divider & Text
  const footerY = pageHeight - 32;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6);

  doc.setTextColor(90, 90, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Lollipop Cake Shop  *  Handcrafted Fresh Daily with Pure Ingredients  *  Tiruchirappalli, Tamil Nadu", pageWidth / 2, footerY + 8, { align: "center" });
  doc.text("Thank you for your order! Helpline / WhatsApp: +91 9489569661", pageWidth / 2, footerY + 19, { align: "center" });

  return new Uint8Array(doc.output("arraybuffer"));
}
