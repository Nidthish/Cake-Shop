// ─────────────────────────────────────────────────────────────────────────
// Core domain types for Lollipop Cake Shop
// ─────────────────────────────────────────────────────────────────────────

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice?: number;
  offer?: string;
  isEggless?: boolean;
}

export interface Product {
  id: string;
  name: string;
  baseName: string;
  category: string;
  subCategory: string;
  categoryName: string;
  badge?: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  price?: number;
  originalPrice?: number;
  minPrice?: number;
  variants: ProductVariant[];
  ingredients?: string[];
  egglessAvailable?: boolean;
  isEggless?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  originalPrice?: number;
  offer?: string;
  quantity: number;
  eggPreference?: "eggless" | "egg";
  cakeMessage?: string;
}

export interface CartSummary {
  subtotal: number;
  sgst: number;
  cgst: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

// ── Customer / Address ─────────────────────────────────────────────────

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  pincode: string;
}

export interface DeliverySchedule {
  date: string;
  timeSlot: string;
}

// ── Roles ───────────────────────────────────────────────────────────────

export type UserRole = "SUPERADMIN" | "ADMIN" | "STAFF" | "CUSTOMER" | "RIDER";

// ── Orders ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAYMENT_INITIATED"
  | "PAID"
  | "PAYMENT_FAILED";

export interface OrderLineItem {
  productId: string;
  name: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isEggless?: boolean;
  eggPreference?: "eggless" | "egg";
  offer?: string;
  cakeMessage?: string;
}

export interface Order {
  id: string;
  items: OrderLineItem[];
  customer: CustomerDetails;
  address: DeliveryAddress;
  schedule: DeliverySchedule;
  subtotal: number;
  sgst: number;
  cgst: number;
  tax: number;
  deliveryFee: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: "COD" | "RAZORPAY" | "DIRECT";
  cakeMessage?: string;
  specialInstructions?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  deliveryOtp?: string;
  deliveryOtpVerified?: boolean;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  deliveredAt?: string;
  assignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Razorpay API payloads ───────────────────────────────────────────────

export interface CreateOrderRequestItem {
  productId: string;
  weight: string;
  quantity: number;
  eggPreference?: "eggless" | "egg";
  cakeMessage?: string;
  offer?: string;
}

export interface CreateOrderRequest {
  items: CreateOrderRequestItem[];
  customer: CustomerDetails;
  address: DeliveryAddress;
  schedule: DeliverySchedule;
}

export interface CreateOrderResponse {
  success: true;
  orderId: string; // our internal order id
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  orderId: string; // our internal order id
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
