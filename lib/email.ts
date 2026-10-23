import nodemailer from "nodemailer";
import type { Order } from "@/types";
import { generateInvoicePdf } from "./invoice";

/**
 * Configure Nodemailer SMTP Transporter
 * Works 100% FREE with Gmail SMTP (App Password) or any free SMTP server (Resend, Mailtrap, Outlook, Yahoo, SendGrid)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.warn(
      "⚠️ [Email Service Notice] SMTP_USER or SMTP_PASS is missing in environment variables. Email will be logged to console in test mode."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/**
 * Generate a luxury HTML invoice receipt for Lollipop Cake Shop
 */
export function generateOrderConfirmationHtml(order: Order): string {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const deliveryDateFormatted = new Date(order.schedule.date).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A;">
          <strong style="color: #802B52; font-size: 15px;">${item.name}</strong><br />
          <span style="font-size: 12px; color: #7A6B72;">
            Weight / Variant: <strong>${item.weight}</strong>
            ${item.eggPreference ? ` | <span style="color: ${item.eggPreference === "eggless" ? "#2E7D32" : "#D97706"}; font-weight: bold;">${item.eggPreference === "eggless" ? "Eggless" : "With Egg"}</span>` : ""}
            ${item.offer ? ` | <span style="color: #802B52; font-weight: bold;">🎁 Offer: ${item.offer}</span>` : ""}
          </span>
          ${item.cakeMessage ? `<br/><span style="font-size: 12px; color: #802B52; font-style: italic;">🎂 Name / Message on Cake: "${item.cakeMessage}"</span>` : ""}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A; text-align: center; font-weight: bold;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A; text-align: right;">
          ₹${item.unitPrice.toFixed(2)}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #802B52; text-align: right; font-weight: bold;">
          ₹${item.lineTotal.toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  const paymentModeLabel = order.paymentMethod === "COD" ? "Cash on Delivery / Direct Order" : order.paymentMethod === "DIRECT" ? "Direct Bakery Order" : "Prepaid Online (Razorpay)";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Lollipop Cake Shop</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF5EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EE; padding: 30px 10px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(128, 43, 82, 0.08); border: 1px solid #E6DBCE;">
            
            <!-- Brand Header -->
            <tr>
              <td style="background-color: #802B52; padding: 32px 30px; text-align: center; color: #FFFFFF;">
                <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.3);">
                  ✨ Official Order Receipt
                </div>
                <h1 style="margin: 0; font-size: 30px; font-weight: bold; letter-spacing: -0.5px; color: #FFFFFF; font-family: Georgia, serif;">
                  Lollipop Cake Shop
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #F1E6DF; font-style: italic;">
                  Handcrafted Luxury Cakes & Pastries
                </p>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="background-color: #FAF3EC; padding: 20px 30px; border-bottom: 1px solid #E6C184; text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #1B5E20; margin-bottom: 4px;">
                  🎉 Thank You! Your Order is Confirmed
                </div>
                <div style="font-size: 13px; color: #5B1E38;">
                  Your order is received and our master bakers are preparing your handcrafted treats!
                </div>
              </td>
            </tr>

            <!-- Delivery Verification OTP Card -->
            <tr>
              <td style="padding: 24px 30px 0 30px;">
                <div style="background-color: #FFFDF8; border: 2px dashed #D4AF37; border-radius: 14px; padding: 18px 24px; text-align: center; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.12);">
                  <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 2px; margin-bottom: 6px;">
                    🔐 Delivery Verification OTP
                  </div>
                  <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #802B52; font-family: 'Courier New', Courier, monospace; margin: 4px 0;">
                    ${order.deliveryOtp || "----"}
                  </div>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #5C524E; line-height: 1.4;">
                    Please share this <strong>4-digit security code</strong> with your delivery partner upon cake handoff to confirm delivery.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 24px 30px 30px 30px;">
                
                <!-- Order & Customer Summary Grid -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                  <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 15px;">
                      <div style="background-color: #FAF5EE; padding: 16px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                          📋 Order & Transaction Details
                        </span>
                        <div style="font-size: 13px; color: #1C0D0A; line-height: 1.6;">
                          <strong>Order ID:</strong> <span style="color: #802B52; font-weight: bold;">${order.id}</span><br />
                          <strong>Payment Method:</strong> ${paymentModeLabel}<br />
                          <strong>Payment Status:</strong> <span style="background-color: ${order.paymentStatus === "PAID" ? "#E8F5E9" : "#FFF3E0"}; color: ${order.paymentStatus === "PAID" ? "#2E7D32" : "#E65100"}; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${order.paymentStatus}</span><br />
                          <strong>Order Date:</strong> ${formattedDate}
                        </div>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 15px;">
                      <div style="background-color: #FAF5EE; padding: 16px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                          📍 Delivery Details
                        </span>
                        <div style="font-size: 13px; color: #1C0D0A; line-height: 1.6;">
                          <strong>Recipient:</strong> ${order.customer.fullName}<br />
                          <strong>Phone:</strong> ${order.customer.phone}<br />
                          <strong>Address:</strong> ${order.address.street}, ${order.address.city} - ${order.address.pincode}<br />
                          <strong>Scheduled Date:</strong> ${deliveryDateFormatted}<br />
                          <strong>Time Slot:</strong> <span style="color: #802B52; font-weight: bold;">${order.schedule.timeSlot}</span><br />
                          <span style="font-size: 11px; color: #7A6B72; display: inline-block; margin-top: 4px;">🛵 <strong>Delivery Charge:</strong> Manually calculated at ₹5 per km from our bakery, payable upon delivery.</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                ${order.cakeMessage || order.specialInstructions ? `
                <!-- Custom Instructions Banner -->
                <div style="background-color: #FFF8E7; border: 1px border-[#E6C184]; border-radius: 12px; padding: 14px 18px; margin-bottom: 25px;">
                  ${order.cakeMessage ? `<div style="font-size: 13px; color: #802B52; margin-bottom: 4px;"><strong>🎂 Custom Message on Cake:</strong> "${order.cakeMessage}"</div>` : ""}
                  ${order.specialInstructions ? `<div style="font-size: 13px; color: #5B1E38;"><strong>📝 Bakery Instructions:</strong> ${order.specialInstructions}</div>` : ""}
                </div>
                ` : ""}

                <!-- Items Table Header -->
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #5B1E38; font-family: Georgia, serif;">
                  🎂 Your Handcrafted Cakes
                </h3>

                <!-- Items Table -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #E6DBCE; border-radius: 12px; overflow: hidden; margin-bottom: 25px;">
                  <thead>
                    <tr style="background-color: #802B52; color: #FFFFFF;">
                      <th align="left" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Item Description</th>
                      <th align="center" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                      <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                      <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Invoice Breakdown -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                  <tr>
                    <td width="55%"></td>
                    <td width="45%">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EE; padding: 16px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #5B1E38;">Items Subtotal:</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #1C0D0A; text-align: right; font-weight: bold;">₹${order.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #5B1E38;">SGST (2.5%):</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #1C0D0A; text-align: right;">₹${order.sgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #5B1E38;">CGST (2.5%):</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #1C0D0A; text-align: right;">₹${order.cgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #5B1E38;">Delivery Charge:</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #802B52; text-align: right; font-weight: bold;">
                            ₹5 / km (Calculated manually)
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top: 10px; border-top: 1px solid #E6DBCE;"></td>
                        </tr>
                        <tr>
                          <td style="font-size: 16px; font-weight: bold; color: #802B52;">Total Paid:</td>
                          <td style="font-size: 18px; font-weight: bold; color: #802B52; text-align: right;">₹${order.total.toFixed(2)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- WhatsApp Support Banner -->
                <div style="background-color: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 12px; padding: 16px; text-align: center;">
                  <span style="font-size: 14px; font-weight: bold; color: #2E7D32;">
                    💬 Need Help or Order Customization?
                  </span>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #1B5E20;">
                    Contact our pastry support directly on WhatsApp at <strong>+91 9489569661</strong> quoting Order ID <strong>${order.id}</strong>.
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #1C0D0A; padding: 24px 30px; text-align: center; color: #D8C3B3; font-size: 12px;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #FFFFFF; font-size: 13px;">
                  Lollipop Cake Shop · Handcrafted Fresh Daily
                </p>
                <p style="margin: 0;">
                  Thank you for celebrating your special moments with us!
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Send Order Confirmation Email to the customer
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const toAddress = order.customer?.email?.trim();
    if (!toAddress || !toAddress.includes("@")) {
      console.warn(`⚠️ [Email Service] Skipping email: invalid customer email "${toAddress}" for Order ${order.id}`);
      return { success: false, error: "Invalid recipient email address" };
    }

    const smtpUser = (process.env.SMTP_USER || "").trim();
    let fromAddress = process.env.EMAIL_FROM?.trim();
    if (!fromAddress || !fromAddress.includes("@")) {
      const fallbackEmail = smtpUser || process.env.INITIAL_ADMIN_EMAIL || "orders@lollipopcakeshop.in";
      fromAddress = `"Lollipop Cake Shop" <${fallbackEmail}>`;
    }

    const htmlContent = generateOrderConfirmationHtml(order);

    let pdfAttachment: any = null;
    try {
      const pdfBytes = generateInvoicePdf(order);
      pdfAttachment = {
        filename: `Lollipop-Invoice-${order.id}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      };
    } catch (pdfErr) {
      console.warn(`⚠️ [Email Service] Could not generate PDF invoice for order ${order.id}:`, pdfErr);
    }

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      replyTo: smtpUser || undefined,
      subject: `🎂 Order Confirmed! Receipt & Tax Invoice for ${order.id} (Delivery OTP: ${order.deliveryOtp || "----"}) - Lollipop Cake Shop`,
      html: htmlContent,
      attachments: pdfAttachment ? [pdfAttachment] : [],
    };

    console.log(`📧 [Email Service] Sending confirmation receipt to ${toAddress} for Order ${order.id}...`);

    // If SMTP environment variables are not set, log and return simulated success
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`ℹ️ [Email Test Mode] SMTP credentials not set. Simulated email sending to ${toAddress}.`);
      return { success: true, messageId: `test-simulated-${order.id}` };
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Sent email successfully! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email Service Error] Failed to send email:", error?.message || error);
    return { success: false, error: error?.message || "Email sending failed" };
  }
}

/**
 * Generate a luxury HTML delivery receipt for Lollipop Cake Shop
 */
export function generateOrderDeliveredHtml(order: Order): string {
  const formattedDeliveryDate = order.deliveredAt
    ? new Date(order.deliveredAt).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A;">
          <strong style="color: #802B52; font-size: 15px;">${item.name}</strong><br />
          <span style="font-size: 12px; color: #7A6B72;">
            Weight / Variant: <strong>${item.weight}</strong>
            ${item.eggPreference ? ` | <span style="color: ${item.eggPreference === "eggless" ? "#2E7D32" : "#D97706"}; font-weight: bold;">${item.eggPreference === "eggless" ? "Eggless" : "With Egg"}</span>` : ""}
            ${item.offer ? ` | <span style="color: #802B52; font-weight: bold;">🎁 Offer: ${item.offer}</span>` : ""}
          </span>
          ${item.cakeMessage ? `<br/><span style="font-size: 12px; color: #802B52; font-style: italic;">🎂 Name / Message on Cake: "${item.cakeMessage}"</span>` : ""}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A; text-align: center; font-weight: bold;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1C0D0A; text-align: right;">
          ₹${item.unitPrice.toFixed(2)}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #802B52; text-align: right; font-weight: bold;">
          ₹${item.lineTotal.toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered - Lollipop Cake Shop</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF5EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EE; padding: 30px 10px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(128, 43, 82, 0.08); border: 1px solid #E6DBCE;">
            
            <!-- Brand Header -->
            <tr>
              <td style="background-color: #802B52; padding: 32px 30px; text-align: center; color: #FFFFFF;">
                <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.3);">
                  ✨ Delivery Complete
                </div>
                <h1 style="margin: 0; font-size: 30px; font-weight: bold; letter-spacing: -0.5px; color: #FFFFFF; font-family: Georgia, serif;">
                  Lollipop Cake Shop
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #F1E6DF; font-style: italic;">
                  Handcrafted Luxury Cakes & Pastries
                </p>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="background-color: #E8F5E9; padding: 24px 30px; border-bottom: 1px solid #A5D6A7; text-align: center;">
                <div style="font-size: 22px; font-weight: bold; color: #1B5E20; margin-bottom: 6px;">
                  🎉 Your Order is Delivered Successfully!
                </div>
                <div style="font-size: 14px; color: #2E7D32; line-height: 1.5;">
                  We hope our handcrafted treats make your special moments even sweeter and more memorable!
                </div>
              </td>
            </tr>

            <!-- Delivered Details Summary -->
            <tr>
              <td style="padding: 24px 30px 0 30px;">
                <div style="background-color: #FFFDF8; border: 1px solid #E6DBCE; border-radius: 14px; padding: 18px 24px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.08);">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size: 13px; color: #1C0D0A; line-height: 1.8;">
                        <strong>Order Number:</strong> <span style="color: #802B52; font-weight: bold;">${order.id}</span><br />
                        <strong>Delivered At:</strong> ${formattedDeliveryDate}<br />
                        ${order.schedule?.timeSlot ? `<strong>Scheduled Delivery Time:</strong> <span style="color: #802B52; font-weight: bold;">${order.schedule.timeSlot}</span><br />` : ""}
                        <strong>Delivered To:</strong> ${order.customer.fullName} (${order.customer.phone})<br />
                        <strong>Address:</strong> ${order.address.street}, ${order.address.city} - ${order.address.pincode}<br />
                        ${order.deliveryPartnerName ? `<strong>Delivery Partner:</strong> ${order.deliveryPartnerName} ${order.deliveryPartnerPhone ? `(${order.deliveryPartnerPhone})` : ""}<br />` : ""}
                        <strong>Status:</strong> <span style="background-color: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">DELIVERED</span>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 20px 30px 30px 30px;">
                ${order.cakeMessage ? `
                <div style="background-color: #FFF8E7; border: 1px solid #E6C184; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px;">
                  <strong style="color: #802B52;">🎂 Message on Cake:</strong> "${order.cakeMessage}"
                </div>
                ` : ""}

                <!-- Items Table Header -->
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #5B1E38; font-family: Georgia, serif;">
                  🎂 Delivered Delicacies
                </h3>

                <!-- Items Table -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #E6DBCE; border-radius: 12px; overflow: hidden; margin-bottom: 25px;">
                  <thead>
                    <tr style="background-color: #802B52; color: #FFFFFF;">
                      <th align="left" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Item Description</th>
                      <th align="center" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                      <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                      <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Total Amount Summary -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                  <tr>
                    <td width="55%"></td>
                    <td width="45%">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EE; padding: 16px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <tr>
                          <td style="font-size: 15px; font-weight: bold; color: #802B52;">Total Paid:</td>
                          <td style="font-size: 17px; font-weight: bold; color: #802B52; text-align: right;">₹${order.total.toFixed(2)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- WhatsApp Feedback Banner -->
                <div style="background-color: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 12px; padding: 16px; text-align: center;">
                  <span style="font-size: 14px; font-weight: bold; color: #2E7D32;">
                    ✨ How was your cake experience?
                  </span>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #1B5E20;">
                    We would love to hear your feedback! Share your photos &amp; reviews on WhatsApp at <strong>+91 9489569661</strong>.
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #1C0D0A; padding: 24px 30px; text-align: center; color: #D8C3B3; font-size: 12px;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #FFFFFF; font-size: 13px;">
                  Lollipop Cake Shop · Handcrafted Fresh Daily
                </p>
                <p style="margin: 0;">
                  Thank you for letting us be a part of your celebrations!
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Send Order Delivered Email to customer (Without invoice - invoice is sent only on order confirmation)
 */
export async function sendOrderDeliveredEmail(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const toAddress = order.customer?.email?.trim();
    if (!toAddress || !toAddress.includes("@")) {
      console.warn(`⚠️ [Email Service] Skipping delivery email: invalid customer email "${toAddress}" for Order ${order.id}`);
      return { success: false, error: "Invalid recipient email address" };
    }

    const smtpUser = (process.env.SMTP_USER || "").trim();
    let fromAddress = process.env.EMAIL_FROM?.trim();
    if (!fromAddress || !fromAddress.includes("@")) {
      const fallbackEmail = smtpUser || process.env.INITIAL_ADMIN_EMAIL || "orders@lollipopcakeshop.in";
      fromAddress = `"Lollipop Cake Shop" <${fallbackEmail}>`;
    }

    const htmlContent = generateOrderDeliveredHtml(order);

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      replyTo: smtpUser || undefined,
      subject: `🎉 Your Order is Delivered Successfully! - Order ${order.id} | Lollipop Cake Shop`,
      html: htmlContent,
      attachments: [], // Invoices are sent exclusively upon Order Confirmation, not delivery
    };

    console.log(`📧 [Email Service] Sending delivery confirmation email to ${toAddress} for Order ${order.id}...`);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`ℹ️ [Email Test Mode] SMTP credentials not set. Simulated delivery email to ${toAddress}.`);
      return { success: true, messageId: `test-delivered-simulated-${order.id}` };
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Sent delivery email successfully! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email Service Error] Failed to send delivery email:", error?.message || error);
    return { success: false, error: error?.message || "Email sending failed" };
  }
}

/**
 * Interface for order cancellation email
 */
export interface OrderCancelledEmailData {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  streetAddress?: string;
  city?: string;
  pincode?: string;
  paymentMethod: string;
  totalAmount: number;
  cancellationReason: string;
  refundStatus?: string;
  refundId?: string | null;
  items?: Array<{
    name: string;
    weight?: string;
    quantity: number;
    unitPrice?: number;
    lineTotal?: number;
    cakeMessage?: string;
  }>;
}

/**
 * Generate a luxury HTML email for Order Cancellation & Refund Details
 */
export function generateOrderCancelledHtml(data: OrderCancelledEmailData): string {
  const isCod =
    data.paymentMethod.toUpperCase() === "COD" ||
    data.paymentMethod.toUpperCase().includes("CASH");

  const itemsHtml = (data.items && data.items.length > 0)
    ? data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 14px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1C0D0A;">
            <strong style="color: #802B52; font-size: 14px;">${item.name}</strong>
            ${item.weight ? `<br/><span style="font-size: 12px; color: #7A6B72;">Weight / Variant: ${item.weight}</span>` : ""}
            ${item.cakeMessage ? `<br/><span style="font-size: 11px; color: #802B52; font-style: italic;">🎂 Message: "${item.cakeMessage}"</span>` : ""}
          </td>
          <td style="padding: 12px 14px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1C0D0A; text-align: center; font-weight: bold;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 14px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1C0D0A; text-align: right;">
            ₹${(item.unitPrice || 0).toFixed(2)}
          </td>
          <td style="padding: 12px 14px; border-bottom: 1px solid #F1E6DF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #802B52; text-align: right; font-weight: bold;">
            ₹${(item.lineTotal || (item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("")
    : "";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancellation - Lollipop Cake Shop</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF5EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EE; padding: 30px 10px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(128, 43, 82, 0.08); border: 1px solid #E6DBCE;">
            
            <!-- Brand Header -->
            <tr>
              <td style="background-color: #802B52; padding: 30px 28px; text-align: center; color: #FFFFFF;">
                <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 7px 16px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.3);">
                  Order Update Notice
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px; color: #FFFFFF; font-family: Georgia, serif;">
                  Lollipop Cake Shop
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #F1E6DF; font-style: italic;">
                  Handcrafted Luxury Cakes & Pastries
                </p>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="background-color: #FFF1F2; padding: 22px 28px; border-bottom: 1.5px solid #FDA4AF; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #BE123C; margin-bottom: 6px;">
                  ❌ Order #${data.orderNumber || data.orderId} Has Been Cancelled
                </div>
                <div style="font-size: 13px; color: #9F1239; line-height: 1.5;">
                  We regret to inform you that your order has been cancelled by our store management. Below are the cancellation details and refund status.
                </div>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 24px 28px 30px 28px;">
                
                <!-- Reason for Cancellation Box -->
                <div style="background-color: #FFF8E7; border: 1.5px dashed #E6C184; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 1.5px; margin-bottom: 6px;">
                    📋 Reason for Cancellation
                  </div>
                  <div style="font-size: 15px; font-weight: 600; color: #1C0D0A; line-height: 1.5; font-style: italic;">
                    "${data.cancellationReason || "Cancelled by store management"}"
                  </div>
                </div>

                <!-- Payment & Refund Details Section -->
                ${
                  !isCod
                    ? `
                <!-- Online Paid / Razorpay Refund Box -->
                <div style="background-color: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 20px 22px; margin-bottom: 24px;">
                  <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #166534; letter-spacing: 1.5px; margin-bottom: 12px;">
                    💳 Refund Information
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #1C0D0A; line-height: 1.9;">
                    <tr>
                      <td style="color: #4B5563;">Original Payment Mode:</td>
                      <td style="font-weight: bold; text-align: right; color: #1C0D0A;">Online Prepaid (${data.paymentMethod || "Razorpay / UPI / Cards"})</td>
                    </tr>
                    <tr>
                      <td style="color: #4B5563;">Refund Amount:</td>
                      <td style="font-weight: 800; color: #15803D; font-size: 16px; text-align: right;">₹${data.totalAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="color: #4B5563;">Refund Status:</td>
                      <td style="font-weight: bold; color: #15803D; text-align: right;">
                        ${data.refundStatus === "REFUNDED" ? "✅ Successfully Initiated via Razorpay" : "✅ Refund Initiated"}
                      </td>
                    </tr>
                    ${
                      data.refundId
                        ? `
                    <tr>
                      <td style="color: #4B5563;">Gateway Refund ID:</td>
                      <td style="font-family: monospace; font-weight: bold; text-align: right; color: #1F2937;">${data.refundId}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>

                  <!-- Prominent Refund Timing Box -->
                  <div style="margin-top: 14px; padding: 14px 16px; background-color: #DCFCE7; border-radius: 10px; border-left: 4px solid #16A34A;">
                    <strong style="color: #14532D; font-size: 13px; display: block; margin-bottom: 5px;">
                      ⏱️ Refund Timing &amp; Bank Settlement:
                    </strong>
                    <p style="margin: 0; font-size: 12.5px; color: #166534; line-height: 1.6;">
                      Your full refund of <strong>₹${data.totalAmount.toFixed(2)}</strong> has been initiated back to your original source account (UPI / Bank Account / Card). According to Reserve Bank of India (RBI) and banking gateway standard settlement cycles, the funds will be credited to your account within <strong>5 to 7 business days</strong>.
                    </p>
                  </div>
                </div>
                `
                    : `
                <!-- COD Notice Box -->
                <div style="background-color: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
                  <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569; letter-spacing: 1.5px; margin-bottom: 8px;">
                    💵 Payment Status
                  </div>
                  <div style="font-size: 13px; color: #1C0D0A; line-height: 1.6;">
                    <strong>Payment Method:</strong> Cash on Delivery (COD)<br />
                    <strong>Order Amount:</strong> ₹${data.totalAmount.toFixed(2)}<br />
                    <span style="color: #64748B; font-size: 12px; display: inline-block; margin-top: 6px;">
                      ℹ️ Since this order was placed under Cash on Delivery, no payment was collected from you, and therefore no refund is required.
                    </span>
                  </div>
                </div>
                `
                }

                <!-- Customer & Order Summary Grid -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 22px;">
                  <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                      <div style="background-color: #FAF5EE; padding: 14px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                          👤 Customer Info
                        </span>
                        <div style="font-size: 12.5px; color: #1C0D0A; line-height: 1.6;">
                          <strong>${data.customerName}</strong><br />
                          ${data.customerPhone ? `Phone: ${data.customerPhone}<br />` : ""}
                          Email: ${data.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                      <div style="background-color: #FAF5EE; padding: 14px; border-radius: 12px; border: 1px solid #E6DBCE;">
                        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #802B52; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                          📦 Order Summary
                        </span>
                        <div style="font-size: 12.5px; color: #1C0D0A; line-height: 1.6;">
                          Order #: <strong style="color: #802B52;">${data.orderNumber || data.orderId}</strong><br />
                          Total: <strong>₹${data.totalAmount.toFixed(2)}</strong><br />
                          Status: <span style="background-color: #FFE4E6; color: #BE123C; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">CANCELLED</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                ${
                  itemsHtml
                    ? `
                <!-- Ordered Items Table Header -->
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #5B1E38; font-family: Georgia, serif;">
                  🎂 Cancelled Order Items
                </h3>

                <!-- Items Table -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #E6DBCE; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                  <thead>
                    <tr style="background-color: #802B52; color: #FFFFFF;">
                      <th align="left" style="padding: 10px 14px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                      <th align="center" style="padding: 10px 14px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                      <th align="right" style="padding: 10px 14px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                      <th align="right" style="padding: 10px 14px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                `
                    : ""
                }

                <!-- WhatsApp & Help Support Banner -->
                <div style="background-color: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 12px; padding: 16px; text-align: center;">
                  <span style="font-size: 13.5px; font-weight: bold; color: #2E7D32; display: block; margin-bottom: 4px;">
                    💬 Questions or Need to Place a New Order?
                  </span>
                  <p style="margin: 0; font-size: 12px; color: #1B5E20; line-height: 1.5;">
                    Contact our bakery team directly on WhatsApp at <strong>+91 9489569661</strong> or call <strong>+91 84893 24697</strong>. We are always ready to assist you!
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #1C0D0A; padding: 22px 28px; text-align: center; color: #D8C3B3; font-size: 12px;">
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #FFFFFF; font-size: 13px;">
                  Lollipop Cake Shop · Handcrafted Fresh Daily
                </p>
                <p style="margin: 0;">
                  Thank you for your understanding. We look forward to serving you again soon!
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Send Order Cancelled Email to customer with reason and refund timing
 */
export async function sendOrderCancelledEmail(
  data: OrderCancelledEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const toAddress = data.customerEmail?.trim();
    if (!toAddress || !toAddress.includes("@")) {
      console.warn(`⚠️ [Email Service] Skipping cancellation email: invalid customer email "${toAddress}" for Order ${data.orderId}`);
      return { success: false, error: "Invalid recipient email address" };
    }

    const smtpUser = (process.env.SMTP_USER || "").trim();
    let fromAddress = process.env.EMAIL_FROM?.trim();
    if (!fromAddress || !fromAddress.includes("@")) {
      const fallbackEmail = smtpUser || process.env.INITIAL_ADMIN_EMAIL || "orders@lollipopcakeshop.in";
      fromAddress = `"Lollipop Cake Shop" <${fallbackEmail}>`;
    }

    const htmlContent = generateOrderCancelledHtml(data);

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      replyTo: smtpUser || undefined,
      subject: `❌ Order #${data.orderNumber || data.orderId} Cancelled - Lollipop Cake Shop`,
      html: htmlContent,
      attachments: [],
    };

    console.log(`📧 [Email Service] Sending cancellation email to ${toAddress} for Order ${data.orderNumber || data.orderId}...`);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`ℹ️ [Email Test Mode] SMTP credentials not set. Simulated cancellation email to ${toAddress}.`);
      return { success: true, messageId: `test-cancelled-simulated-${data.orderId}` };
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Sent cancellation email successfully! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email Service Error] Failed to send cancellation email:", error?.message || error);
    return { success: false, error: error?.message || "Email sending failed" };
  }
}

