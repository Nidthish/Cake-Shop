"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("orderId") || searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery.trim()) {
      executeSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  async function executeSearch(query: string) {
    const q = query.trim();
    if (!q) {
      setErrorMsg("Please enter your Order ID or registered mobile phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setErrorMsg(`No orders found matching "${q}". Please double-check your Order ID or phone number.`);
        }
      } else {
        setOrders([]);
        setErrorMsg(data.error || "Unable to locate order. Please check your query.");
      }
    } catch {
      setOrders([]);
      setErrorMsg("Network error searching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    executeSearch(searchQuery);
  }

  function getStepIndex(status: string) {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
        return 1;
      case "PREPARING":
      case "PROCESSING":
        return 2;
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 1;
    }
  }

  return (
    <div className="bg-[#FAF5EE] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-[#802B52]/10 text-[#802B52] border border-[#802B52]/20 font-mono text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            🔍 Live Order Status &amp; Tracking
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
            Track Your Cake Order Status
          </h1>
          <p className="text-sm text-[#5C524E] max-w-xl mx-auto">
            Enter your <strong>Order Number</strong> (e.g. <code>LLP-2026...</code>) or <strong>10-digit mobile phone number</strong> to view live delivery progress and payment details.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#802B52]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (LLP-...) or 10-digit Mobile Number"
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52] placeholder-[#7A6B72]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#250527] hover:bg-[#4A0E4E] text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Find Order</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Help Hints */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#7A6B72]">
            <span>💡 Tip: You can search by your 10-digit mobile number to track active orders.</span>
          </div>
        </div>

        {/* Error / Alert Message */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-sm text-center shadow-sm">
            {errorMsg}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[#E6C184]/30 p-16 text-center text-sm text-[#7A6B72]">
            <div className="w-10 h-10 border-4 border-[#802B52] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Locating order status...
          </div>
        )}

        {/* Order Results List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#802B52]">
                Found {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {orders.map((order) => {
              const currentStep = getStepIndex(order.orderStatus);
              const isDelivered = order.orderStatus === "DELIVERED";
              const isOutForDelivery = order.orderStatus === "OUT_FOR_DELIVERY";
              const isCancelled = order.orderStatus === "CANCELLED";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#E6C184]/40 shadow-xl overflow-hidden space-y-6 p-6 sm:p-8"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6C184]/30">
                    <div>
                      <span className="font-mono text-xs font-bold bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] px-3 py-1 rounded-full uppercase tracking-wider">
                        #{order.id}
                      </span>
                      <div className="text-xs text-[#7A6B72] mt-1.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          isDelivered
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : isCancelled
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Delivered Banner */}
                  {isDelivered && (
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-2xl">
                          🎉
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-emerald-950">
                            Order Delivered Successfully!
                          </h3>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            {order.deliveredAt
                              ? `Handed over on ${new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                              : "Your fresh cake order has been delivered."}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Delivered
                      </span>
                    </div>
                  )}

                  {/* Out For Delivery Banner */}
                  {isOutForDelivery && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-2xl animate-bounce">
                          🚚
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-amber-950">
                            Out for Delivery!
                          </h3>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Your order is currently on the way with our delivery team.
                            {order.deliveryPartnerName && ` Delivery Agent: ${order.deliveryPartnerName}`}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-200 text-amber-950 border border-amber-300">
                        <span className="material-symbols-outlined text-base">local_shipping</span>
                        In Transit
                      </span>
                    </div>
                  )}

                  {/* Cancelled Banner */}
                  {isCancelled && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 text-red-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-2xl">
                          ❌
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-red-950">
                            Order Cancelled
                          </h3>
                          <p className="text-xs text-red-800 mt-0.5">
                            {order.cancellationReason ? `Reason: ${order.cancellationReason}` : "This order has been marked as cancelled."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4-Step Visual Progress Tracker */}
                  {!isCancelled && (
                    <div className="bg-[#FAF5EE] rounded-2xl p-4 sm:p-6 border border-[#E6DBCE]">
                      <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#802B52] mb-4 text-center sm:text-left">
                        🚚 Live Delivery Progress
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        {[
                          { step: 1, label: "Order Confirmed", icon: "check_circle" },
                          { step: 2, label: "Freshly Baking", icon: "cookie" },
                          { step: 3, label: "Out for Delivery", icon: "local_shipping" },
                          { step: 4, label: "Delivered", icon: "verified" },
                        ].map((s) => {
                          const isDone = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;

                          return (
                            <div
                              key={s.step}
                              className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                isDone
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                                  : isCurrent
                                  ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                                  : "bg-white/60 border-slate-200 text-slate-400"
                              }`}
                            >
                              <span className="material-symbols-outlined text-2xl">
                                {s.icon}
                              </span>
                              <span className="text-xs">{s.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Summary Grid: Delivery & Payment Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#E6DBCE] space-y-1.5">
                      <span className="font-bold text-[#802B52] uppercase tracking-wider block text-[10px] mb-1">
                        📍 Delivery Information
                      </span>
                      <div><strong>Recipient:</strong> {order.customer?.fullName || "Customer"} ({order.customer?.phone || ""})</div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {order.address?.street ? `${order.address.street}, ` : ""}
                        {order.address?.city || "Trichy"} - {order.address?.pincode || ""}
                      </div>
                      <div>
                        <strong>Scheduled Date:</strong>{" "}
                        {new Date(order.schedule.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div><strong>Time Slot:</strong> <span className="font-bold text-[#802B52]">{order.schedule.timeSlot}</span></div>
                    </div>

                    <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#E6DBCE] space-y-1.5">
                      <span className="font-bold text-[#802B52] uppercase tracking-wider block text-[10px] mb-1">
                        💳 Payment Information
                      </span>
                      <div><strong>Payment Mode:</strong> {order.paymentMethod === "COD" ? "Cash on Delivery" : "Prepaid Online (Razorpay)"}</div>
                      <div>
                        <strong>Payment Status:</strong>{" "}
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <strong>Transaction ID:</strong>{" "}
                        <span className="font-mono text-[#5C524E]">
                          {order.razorpayPaymentId || order.razorpayOrderId || (order.paymentMethod === "COD" ? "Pay on Delivery" : "N/A")}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-[#E6DBCE] font-bold text-sm text-[#802B52] flex justify-between">
                        <span>Total Amount:</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Item List */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#1C0D0A] mb-2.5">
                      🎂 Ordered Items ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E6DBCE] flex justify-between items-center text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#1C0D0A]">{item.name}</div>
                            <div className="text-[11px] text-[#7A6B72]">
                              Variant: {item.weight} &bull; Qty: {item.quantity}
                              {item.eggPreference && ` • ${item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 With Egg"}`}
                            </div>
                            {item.cakeMessage && (
                              <div className="text-[11px] text-[#802B52] italic mt-0.5">
                                Cake Message: &quot;{item.cakeMessage}&quot;
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-[#802B52]">
                            ₹{item.lineTotal}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar: WhatsApp Support */}
                  <div className="pt-4 border-t border-[#E6C184]/30 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#7A6B72]">
                      Have a query about your order delivery? Chat directly with our bakery team.
                    </p>

                    <a
                      href={`https://wa.me/919489569661?text=${encodeURIComponent(`Hi Lollipop Cake Shop, I have a query regarding my Order #${order.id}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>💬</span> WhatsApp Bakery Help
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Empty State when no query entered yet */}
        {!hasSearched && !loading && (
          <div className="bg-white rounded-3xl border border-[#E6C184]/30 p-12 text-center space-y-4 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#D4AF37]">
              local_shipping
            </span>
            <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
              Check Your Order Progress
            </h3>
            <p className="text-xs text-[#5C524E] max-w-md mx-auto">
              Enter your Order ID or registered mobile phone number above to see real-time baking and delivery status.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-[#9C8B84]">
          Loading Order Search...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
