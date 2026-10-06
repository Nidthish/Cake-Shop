"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  const downloadedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  // Auto-download invoice once order data is ready
  useEffect(() => {
    if (order && !downloadedRef.current) {
      downloadedRef.current = true;
      const timer = setTimeout(() => {
        try {
          const link = document.createElement("a");
          link.href = `/api/orders/${order.id}/invoice?download=1`;
          link.setAttribute("download", `Lollipop-Invoice-${order.id}.html`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setAutoDownloaded(true);
        } catch {
          // Handled gracefully
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [order]);

  function copyOtp() {
    if (!order?.deliveryOtp) return;
    navigator.clipboard.writeText(order.deliveryOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleManualDownload() {
    if (!order) return;
    window.location.href = `/api/orders/${order.id}/invoice?download=1`;
  }

  function handlePrintInvoice() {
    if (!order) return;
    window.open(`/api/orders/${order.id}/invoice?print=1`, "_blank");
  }

  return (
    <div className="bg-[#FAF5EE] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Banner Card */}
        <div className="bg-white rounded-3xl border border-[#E6C184]/40 p-8 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner text-emerald-600">
            ✓
          </div>
          <div>
            <span className="inline-block bg-[#802B52]/10 text-[#802B52] border border-[#802B52]/20 font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Order ID: {orderId || "Confirmed"}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
              Thank You! Your Order is Confirmed
            </h1>
            <p className="text-sm text-[#5C524E] mt-1">
              Our master pastry chefs are preparing your handcrafted cakes fresh!
            </p>
          </div>

          <div className="bg-[#FAF3EC] rounded-2xl p-4 border border-[#E6C184]/30 text-xs text-[#802B52] font-semibold flex items-center justify-center gap-2">
            <span>📬</span>
            <span>
              An official HTML invoice receipt with delivery timing details and OTP has been emailed to{" "}
              <strong>{order?.customer?.email || "your email address"}</strong>.
            </span>
          </div>

          {autoDownloaded && (
            <div className="bg-emerald-50 text-emerald-800 rounded-xl p-3 border border-emerald-200 text-xs font-medium flex items-center justify-center gap-2 animate-fade-in">
              <span>📥</span>
              <span>Your invoice has been automatically downloaded to your device!</span>
            </div>
          )}
        </div>

        {/* Prominent Delivery OTP Card */}
        {order && (
          <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FFFDF9] border-2 border-dashed border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">🔐</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#802B52]">
                Delivery Verification OTP
              </span>
            </div>
            
            <div className="my-2">
              <span className="font-mono text-4xl sm:text-5xl font-black tracking-[8px] text-[#250527] bg-white/90 border border-[#E6DBCE] px-6 py-2.5 rounded-2xl shadow-inner inline-block">
                {order.deliveryOtp || "----"}
              </span>
            </div>

            <p className="text-xs text-[#5C524E] max-w-md mx-auto mt-2 leading-relaxed">
              Please share this <strong>4-digit security code</strong> with your delivery partner upon arrival to confirm handoff.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyOtp}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#802B52] text-white hover:bg-[#601F3E] transition-colors shadow-sm"
              >
                <span>📋</span> {copied ? "Copied to Clipboard!" : "Copy OTP Code"}
              </button>

              {order.deliveryOtpVerified && (
                <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ Verified &amp; Delivered
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Action Buttons: Download & Print Invoice */}
        {order && (
          <div className="bg-white rounded-2xl border border-[#E6C184]/40 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#5C524E] text-center sm:text-left">
              <strong className="text-[#1C0D0A] block">Official Tax Invoice Receipt</strong>
              Includes all pricing breakdowns, GST tax details, and verification OTP.
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleManualDownload}
                className="flex-1 sm:flex-initial bg-[#250527] hover:bg-[#4A0E4E] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>📥</span> Download Invoice
              </button>
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="flex-1 sm:flex-initial bg-[#D4AF37] hover:bg-[#C29D26] text-[#250527] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>🖨️</span> Print / PDF
              </button>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E6C184]/30 p-12 text-center text-sm text-[#7A6B72]">
            <div className="w-8 h-8 border-4 border-[#802B52] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Fetching real-time order breakdown...
          </div>
        ) : order ? (
          <div className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 sm:p-8 shadow-lg space-y-6">
            
            {/* Grid 1: Summary Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#E6C184]/30">
              <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#E6DBCE] space-y-1 text-xs">
                <span className="font-bold text-[#802B52] uppercase tracking-wider block text-[10px] mb-1">
                  📋 Order Information
                </span>
                <div><strong>Order ID:</strong> <span className="font-mono text-[#802B52]">{order.id}</span></div>
                <div><strong>Payment Method:</strong> {order.paymentMethod === "COD" ? "Cash / Pay on Delivery" : "Prepaid Online (Razorpay)"}</div>
                <div>
                  <strong>Payment Status:</strong>{" "}
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#E6DBCE] space-y-1 text-xs">
                <span className="font-bold text-[#802B52] uppercase tracking-wider block text-[10px] mb-1">
                  ⏰ Delivery Schedule &amp; Contact
                </span>
                <div><strong>Recipient:</strong> {order.customer.fullName} ({order.customer.phone})</div>
                <div><strong>Delivery Date:</strong> {new Date(order.schedule.date).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</div>
                <div><strong>Time Slot:</strong> <span className="font-bold text-[#802B52]">{order.schedule.timeSlot}</span></div>
                <div><strong>Address:</strong> {order.address.street}, {order.address.city} - {order.address.pincode}</div>
              </div>
            </div>

            {/* Custom Notes Section if provided */}
            {(order.cakeMessage || order.specialInstructions) && (
              <div className="bg-[#FFF8E7] p-4 rounded-2xl border border-[#E6C184]/50 space-y-2 text-xs">
                {order.cakeMessage && (
                  <div>
                    <strong className="text-[#802B52]">🎂 Custom Message on Cake:</strong>{" "}
                    <span className="italic font-medium text-[#1C0D0A]">&quot;{order.cakeMessage}&quot;</span>
                  </div>
                )}
                {order.specialInstructions && (
                  <div>
                    <strong className="text-[#5B1E38]">📝 Bakery Instructions:</strong>{" "}
                    <span className="text-[#1C0D0A]">{order.specialInstructions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Items Table */}
            <div>
              <h3 className="font-display font-bold text-base text-[#1C0D0A] mb-3">
                🎂 Handcrafted Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#E6DBCE] flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#1C0D0A]">{item.name}</div>
                      <div className="text-[11px] text-[#7A6B72] mt-0.5 flex items-center gap-2">
                        <span>Variant: <strong>{item.weight}</strong></span>
                        <span>•</span>
                        <span className={item.eggPreference === "eggless" ? "text-emerald-700 font-bold" : "text-amber-700"}>
                          {item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 With Egg"}
                        </span>
                      </div>
                      {item.cakeMessage && (
                        <div className="text-[11px] text-[#802B52] italic mt-0.5">
                          Message: &quot;{item.cakeMessage}&quot;
                        </div>
                      )}
                      <div className="text-[11px] text-[#5C524E] mt-0.5">
                        Qty: {item.quantity} × ₹{item.unitPrice}
                      </div>
                    </div>
                    <div className="font-extrabold text-base text-[#802B52]">
                      ₹{item.lineTotal}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#E6DBCE] space-y-2 text-xs text-[#5C524E]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#1C0D0A]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5% GST):</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="border-t border-[#E6DBCE] pt-2 mt-2 flex justify-between text-base font-extrabold text-[#802B52]">
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>

          </div>
        ) : null}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/track-order"
            className="w-full sm:w-auto bg-[#250527] hover:bg-[#4A0E4E] text-white text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-colors shadow-md text-center"
          >
            <span>🔍</span> Track Order Live
          </Link>
          <Link
            href="/"
            className="btn-primary w-full sm:w-auto py-3.5 px-8 text-xs font-bold uppercase tracking-wider text-center"
          >
            Back to Home Page
          </Link>
          <a
            href="https://wa.me/919489569661"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider shadow-md"
          >
            <span>💬</span> WhatsApp Store Chef (+91 9489569661)
          </a>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-[#9C8B84]">
          Loading Order Confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
