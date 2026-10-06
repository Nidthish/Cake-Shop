import nodemailer from "nodemailer";
import type { Order } from "@/types";

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
function generateOrderConfirmationHtml(order: Order): string {
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
            ${item.eggPreference ? ` | <span style="color: ${item.eggPreference === "eggless" ? "#2E7D32" : "#D97706"}; font-weight: bold;">${item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 With Egg"}</span>` : ""}
          </span>
          ${item.cakeMessage ? `<br/><span style="font-size: 12px; color: #802B52; font-style: italic;">🎂 Message: "${item.cakeMessage}"</span>` : ""}
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
                  Handcrafted Luxury Artisanal Cakes & Pastries
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
                          <strong>Time Slot:</strong> <span style="color: #802B52; font-weight: bold;">${order.schedule.timeSlot}</span>
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
                          <td style="padding: 4px 0; font-size: 13px; color: #1B5E20; text-align: right; font-weight: bold;">
                            ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee.toFixed(2)}`}
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
      fromAddress = `"Lollipop Cake Shop" <${smtpUser || "no-reply@lollipopcakeshop.com"}>`;
    }

    const htmlContent = generateOrderConfirmationHtml(order);

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      replyTo: smtpUser || undefined,
      subject: `🎂 Order Confirmed! Receipt & Invoice for ${order.id} (Delivery OTP: ${order.deliveryOtp || "----"}) - Lollipop Cake Shop`,
      html: htmlContent,
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
