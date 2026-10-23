"use client";

import { useEffect, useState, useMemo } from "react";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface VariantInput {
  id?: string;
  name: string;
  price: number;
  weightValue: number;
  weightUnit: string;
  isEggless: boolean;
  serves: string;
  offer?: string;
  isOffer1kgFree?: boolean;
}

interface ProductAdmin {
  id: string;
  slug: string;
  productCode: string;
  name: string;
  category: string;
  categoryName: string;
  subCategory: string;
  description: string;
  imageName: string;
  image?: string;
  price?: number;
  badge?: string;
  rating: number;
  reviewCount: number;
  productType: string;
  isActive: boolean;
  isOfferProduct?: boolean;
  isEggless?: boolean;
  egglessAvailable?: boolean;
  variants: VariantInput[];
  offers: any[];
}

interface OrderAdmin {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  pincode: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  hasEgglessItems: boolean;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryPartnerName?: string | null;
  deliveryPartnerPhone?: string | null;
  deliveryOtp?: string | null;
  deliveryOtpVerified?: boolean;
  deliveredAt?: string | null;
  assignedAt?: string | null;
  createdAt: string;
  specialInstructions?: string | null;
  deliveryNotes?: string | null;
  cakeMessage?: string | null;
  items: any[];
}

const PRIMARY_CATEGORIES = [
  { slug: "cakes", name: "Cakes (Normal & Flavored)" },
  { slug: "dry-cakes", name: "Dry Cakes" },
  { slug: "snacks", name: "Snacks & Pastries" },
  { slug: "bento-cake", name: "Bento Cakes" },
  { slug: "wedding-cakes", name: "Wedding Cakes" },
  { slug: "first-birthday", name: "1st Birthday Cakes" },
  { slug: "custom-cake", name: "Customized Cakes" },
];

const DEFAULT_CAKE_SUBCATEGORIES = [
  "Normal Flavors",
  "Choco Cakes",
  "Choco Special",
  "Delight Cakes",
  "Rich Special",
  "Premium Cakes",
  "Fruit Cakes",
  "Extreme Combo",
];

const STORAGE_KEY = "cakes";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface RawStoredCake {
  id?: string | number;
  slug?: string;
  productCode?: string;
  name?: string;
  category?: string;
  categoryName?: string;
  subCategory?: string;
  description?: string;
  imageName?: string;
  image?: string;
  badge?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  productType?: string;
  isActive?: boolean;
  isOfferProduct?: boolean;
  isEggless?: boolean;
  egglessAvailable?: boolean;
  variants?: VariantInput[];
  offers?: unknown[];
}

function getStoredCakes(): RawStoredCake[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to parse cakes from localStorage", err);
    return [];
  }
}

function normalizeCake(c: RawStoredCake): ProductAdmin {
  const fallbackVariants: VariantInput[] =
    Array.isArray(c.variants) && c.variants.length > 0
      ? c.variants.map((v) => ({
        id: v.id ? String(v.id) : undefined,
        name: v.name || "Regular",
        price: typeof v.price === "number" ? v.price : 0,
        weightValue: typeof v.weightValue === "number" ? v.weightValue : 0.5,
        weightUnit: v.weightUnit || "kg",
        isEggless: v.isEggless !== undefined ? Boolean(v.isEggless) : true,
        serves: v.serves || "4-6 Servings",
        offer: v.offer || "",
        isOffer1kgFree: Boolean(v.isOffer1kgFree),
      }))
      : [
        {
          name: "Regular",
          price: typeof c.price === "number" ? c.price : 450,
          weightValue: 0.5,
          weightUnit: "kg",
          isEggless: true,
          serves: "4-6 Servings",
          offer: "",
          isOffer1kgFree: false,
        },
      ];

  const isBento = (c.category || "").toLowerCase().includes("bento");
  const egglessAvail = c.egglessAvailable !== undefined ? Boolean(c.egglessAvailable) : (isBento ? false : true);

  return {
    id: String(c.id || Date.now()),
    slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "cake"),
    productCode: c.productCode || `LOL-${c.id || "001"}`,
    name: c.name || "Untitled Cake",
    category: c.category || "cakes",
    categoryName: c.categoryName || (c.category ? c.category.toUpperCase() : "Cakes"),
    subCategory: c.subCategory || "Normal Flavors",
    description: c.description || "",
    imageName: c.imageName || "signature.cake.1",
    image: c.image || undefined,
    badge: c.badge || undefined,
    rating: typeof c.rating === "number" ? c.rating : 5.0,
    reviewCount: typeof c.reviewCount === "number" ? c.reviewCount : 1,
    productType: c.productType || "CAKE",
    isActive: c.isActive !== undefined ? Boolean(c.isActive) : true,
    isOfferProduct: Boolean(c.isOfferProduct),
    isEggless: c.isEggless !== undefined ? Boolean(c.isEggless) : true,
    egglessAvailable: egglessAvail,
    variants: fallbackVariants,
    offers: Array.isArray(c.offers) ? c.offers : [],
    price: typeof c.price === "number" ? c.price : fallbackVariants[0]?.price,
  };
}

function saveCakeToLocalStorage(cake: ProductAdmin) {
  if (typeof window === "undefined") return;
  try {
    const cakes = getStoredCakes();
    const index = cakes.findIndex((c) => String(c.id) === String(cake.id));
    if (index >= 0) {
      const existingImage = cakes[index].image;
      const finalImage = cake.image !== undefined ? cake.image : existingImage;
      cakes[index] = {
        ...cakes[index],
        ...cake,
      };
      if (finalImage) {
        cakes[index].image = finalImage;
      } else {
        delete cakes[index].image;
      }
    } else {
      cakes.unshift(cake);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cakes));
  } catch (err) {
    console.warn("Failed to save cake to localStorage", err);
  }
}

function updateCakeInLocalStorage(id: string, partial: Partial<ProductAdmin>) {
  if (typeof window === "undefined") return;
  try {
    const cakes = getStoredCakes();
    const index = cakes.findIndex((c) => String(c.id) === String(id));
    if (index >= 0) {
      cakes[index] = { ...cakes[index], ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cakes));
    }
  } catch (err) {
    console.warn("Failed to update cake in localStorage", err);
  }
}

function deleteCakeFromLocalStorage(id: string) {
  if (typeof window === "undefined") return;
  try {
    const cakes = getStoredCakes();
    const updated = cakes.filter((c) => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to delete cake from localStorage", err);
  }
}

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Navigation & Data State
  const [activeTab, setActiveTab] = useState<"sales" | "products" | "orders" | "users">("sales");
  const [products, setProducts] = useState<ProductAdmin[]>([]);

  // Orders State (Default: Today's Orders with On-Demand DB Search)
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersDateFilter, setOrdersDateFilter] = useState<"today" | "yesterday" | "7days" | "month" | "all">("today");
  const [ordersSearchInput, setOrdersSearchInput] = useState<string>("");
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<OrderAdmin | null>(null);

  // Sales Orders State (Scoped to analytics date filter)
  const [salesOrders, setSalesOrders] = useState<OrderAdmin[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [salesDateFilter, setSalesDateFilter] = useState<"today" | "yesterday" | "7days" | "month" | "all">("today");

  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Product Filter & Modal State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Add Product Form State
  const [name, setName] = useState<string>("");
  const [categorySlug, setCategorySlug] = useState<string>("cakes");
  const [subCategory, setSubCategory] = useState<string>("Normal Flavors");
  const [customSubCategory, setCustomSubCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageName, setImageName] = useState<string>("signature.cake.1");
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    originalSizeKb: number;
    webpSizeKb: number;
  } | null>(null);
  const [badge, setBadge] = useState<string>("");
  const [egglessAvailable, setEgglessAvailable] = useState<boolean>(true);
  const isCakeCategory = ["cakes", "bento-cake", "wedding-cakes", "first-birthday", "custom-cake"].includes(categorySlug);
  const [variants, setVariants] = useState<VariantInput[]>([
    { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", offer: "", isOffer1kgFree: false },
    { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", offer: "", isOffer1kgFree: false },
  ]);

  // Special Offer Form State
  const [hasOffer, setHasOffer] = useState<boolean>(false);
  const [offerBadge, setOfferBadge] = useState<string>("1kg Free Offer");
  const [offerBuyVariant, setOfferBuyVariant] = useState<string>("1kg");
  const [offerFreeVariant, setOfferFreeVariant] = useState<string>("0.5kg");

  // Create Admin / Rider User Modal State
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>("");
  const [newAdminEmail, setNewAdminEmail] = useState<string>("");
  const [newAdminPhone, setNewAdminPhone] = useState<string>("");
  const [newAdminPassword, setNewAdminPassword] = useState<string>("");
  const [newAdminRole, setNewAdminRole] = useState<"ADMIN" | "SUPERADMIN" | "RIDER">("ADMIN");
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  // Check auth session on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredCakes();
    if (stored.length > 0) {
      setProducts(stored.map(normalizeCake));
    }
    checkAuthSession();
  }, []);

  async function checkAuthSession() {
    setCheckingAuth(true);
    try {
      const res = await fetch("/api/admin/auth/me");
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        setLoginPassword("");
        loadDashboardData();
      } else {
        setLoginError(data.error || "Invalid email or password.");
      }
    } catch (err: any) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) { }
    setIsAuthenticated(false);
    setAdminUser(null);
    setLoginPassword("");
  }

  async function loadDashboardData() {
    setLoading(true);
    await Promise.all([
      fetchProducts(),
      fetchOrders("today", ""),
      fetchSalesOrders("today"),
      fetchAdminUsers(),
    ]);
    setLoading(false);
  }

  async function fetchProducts() {
    const storedCakes = getStoredCakes();
    const storedMap = new Map<string, RawStoredCake>();
    storedCakes.forEach((c) => {
      if (c && c.id) storedMap.set(String(c.id), c);
    });

    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) {
          const merged: ProductAdmin[] = data.products.map((p: RawStoredCake) => {
            const stored = storedMap.get(String(p.id));
            return {
              ...normalizeCake(p),
              image: stored?.image || p.image || undefined,
            };
          });

          // Retain any local-only cakes that are not present in the API
          const apiIds = new Set(data.products.map((p: RawStoredCake) => String(p.id)));
          storedCakes.forEach((sc) => {
            if (sc && sc.id && !apiIds.has(String(sc.id))) {
              merged.push(normalizeCake(sc));
            }
          });

          setProducts(merged);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (err) {
              console.warn("Failed to sync merged cakes to localStorage", err);
            }
          }
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch products from API, falling back to localStorage", err);
    }

    if (storedCakes.length > 0) {
      setProducts(storedCakes.map(normalizeCake));
    }
  }

  // Fetch orders with selective date filter or on-demand DB search
  async function fetchOrders(dateFilter = ordersDateFilter, searchQuery = activeSearchQuery) {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      const q = (searchQuery || "").trim();
      if (q) {
        params.set("q", q);
        if (dateFilter && dateFilter !== "all") {
          params.set("date", dateFilter);
        } else {
          params.set("date", "all");
        }
      } else {
        params.set("date", dateFilter || "today");
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setOrdersLoading(false);
    }
  }

  // Fetch sales overview orders on-demand for specific date range
  async function fetchSalesOrders(dateFilter = salesDateFilter) {
    setSalesLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?date=${dateFilter}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setSalesOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Failed to fetch sales orders", err);
    } finally {
      setSalesLoading(false);
    }
  }

  // On-demand database search handler triggered on button click or Enter key
  async function handleSearchOrders(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const query = ordersSearchInput.trim();
    if (!query) {
      setActiveSearchQuery("");
      fetchOrders(ordersDateFilter, "");
      return;
    }
    setActiveSearchQuery(query);
    await fetchOrders("all", query);
  }

  // Reset search and return to today's orders
  function handleClearSearch() {
    setOrdersSearchInput("");
    setActiveSearchQuery("");
    setOrdersDateFilter("today");
    fetchOrders("today", "");
  }

  // Switch orders date filter and query database
  function handleSelectOrdersDateFilter(filter: "today" | "yesterday" | "7days" | "month" | "all") {
    setOrdersSearchInput("");
    setActiveSearchQuery("");
    setOrdersDateFilter(filter);
    fetchOrders(filter, "");
  }

  // Switch sales overview date filter and query database
  function handleSalesDateChange(filterKey: "today" | "yesterday" | "7days" | "month" | "all") {
    setSalesDateFilter(filterKey);
    fetchSalesOrders(filterKey);
  }

  async function fetchAdminUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users) setAdminUsersList(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch admin users", err);
    }
  }

  // Create Admin or Rider User Handler
  async function handleCreateAdminUser(e: React.FormEvent) {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newAdminName,
          email: newAdminEmail,
          phone: newAdminPhone,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlertMessage(data.message || `User "${newAdminName}" created successfully.`);
        setShowUserModal(false);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPhone("");
        setNewAdminPassword("");
        fetchAdminUsers();
      } else {
        alert(data.error || "Failed to create user.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setCreatingUser(false);
    }
  }

  // Helper to determine if an order is Cash on Delivery
  const isCodOrder = (o: OrderAdmin) => {
    const pm = (o.paymentMethod || "").toString().trim().toUpperCase();
    return pm === "COD" || pm.includes("CASH");
  };

  // Sales Statistics dynamically computed for the selected timeline
  // 1. Number of Orders, 2. Cash on Delivery, 3. GPay, 4. Total Amount
  const salesStats = useMemo(() => {
    // Valid non-cancelled orders for revenue & financial amounts
    const validOrders = salesOrders.filter((o) => o.status !== "CANCELLED");
    const cancelledOrders = salesOrders.filter((o) => o.status === "CANCELLED");

    // 1. Number of Orders (total orders placed in the selected timeline)
    const totalOrdersCount = salesOrders.length;
    const activeOrdersCount = validOrders.length;
    const cancelledCount = cancelledOrders.length;

    // Delivered Orders and In-Progress Delivery Orders
    const deliveredOrders = validOrders.filter((o) => o.status === "DELIVERED");
    const deliveredCount = deliveredOrders.length;
    const pendingDeliveryOrders = validOrders.filter((o) => o.status !== "DELIVERED");
    const pendingDeliveryCount = pendingDeliveryOrders.length;

    // 2. Cash on Delivery (COD)
    const codOrders = validOrders.filter(isCodOrder);
    const codAmount = codOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const codCount = codOrders.length;

    // 3. GPay / Online (UPI, Razorpay, GPay, Card, Net Banking)
    const gpayOrders = validOrders.filter((o) => !isCodOrder(o));
    const gpayAmount = gpayOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const gpayCount = gpayOrders.length;

    // 4. Total Amount (Sum of all orders in selected timeline)
    const totalAmount = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    // GST & Fee totals for comprehensive analysis
    const totalSubtotal = validOrders.reduce((sum, o) => sum + Number(o.subtotal || 0), 0);
    const totalGst = validOrders.reduce((sum, o) => sum + Number(o.taxAmount || 0), 0);
    const totalDeliveryFee = validOrders.reduce((sum, o) => sum + Number(o.deliveryFee || 0), 0);

    return {
      totalOrdersCount,
      deliveredCount,
      pendingDeliveryCount,
      activeOrdersCount,
      cancelledCount,
      codAmount,
      codCount,
      gpayAmount,
      gpayCount,
      totalAmount,
      totalSubtotal,
      totalGst,
      totalDeliveryFee,
    };
  }, [salesOrders]);

  // Export Orders Excel / CSV Spreadsheet with full monthly analysis
  function handleExportOrdersExcel() {
    if (!salesOrders || salesOrders.length === 0) {
      alert("No orders available to export for the selected timeline.");
      return;
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Determine target month from the orders or current date
    let targetDate = new Date();
    if (salesOrders.length > 0 && salesOrders[0].createdAt) {
      const parsedDate = new Date(salesOrders[0].createdAt);
      if (!isNaN(parsedDate.getTime())) {
        targetDate = parsedDate;
      }
    }

    const monthName = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    const timelineLabel =
      salesDateFilter === "month"
        ? "Monthly"
        : salesDateFilter === "today"
          ? "Today"
          : salesDateFilter === "yesterday"
            ? "Yesterday"
            : salesDateFilter === "7days"
              ? "7Days"
              : "All";

    const fileName = `Lollipop_Orders_${monthName}_${year}_${timelineLabel}.csv`;

    const escapeCsv = (val: any): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""').replace(/\r?\n|\r/g, " ");
      return `"${str}"`;
    };

    const headers = [
      "Order Number",
      "Order Date & Time",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Delivery Address",
      "City",
      "Pincode",
      "Delivery Date",
      "Delivery Time Slot",
      "Order Status",
      "Payment Method",
      "Payment Status",
      "Ordered Cakes & Items Details",
      "Total Cake Items",
      "Eggless Order?",
      "Cake Message",
      "Special Instructions",
      "Subtotal (₹)",
      "SGST (2.5%) (₹)",
      "CGST (2.5%) (₹)",
      "Total GST (5%) (₹)",
      "Delivery Fee (₹)",
      "Total Amount (₹)",
      "Delivery Partner Name",
      "Delivery Partner Phone",
      "Delivered Date & Time",
    ];

    const rows: string[][] = salesOrders.map((o) => {
      let itemsSummary = "No item details";
      let totalQty = 0;
      if (Array.isArray(o.items) && o.items.length > 0) {
        itemsSummary = o.items
          .map((it: any) => {
            const cakeName = it.productName || it.name || "Cake";
            const variant = it.variantName ? ` (${it.variantName})` : "";
            const eggless = it.isEggless ? " [Eggless]" : "";
            const qty = it.quantity || 1;
            totalQty += qty;
            const price = it.lineTotal || it.unitPrice ? ` - ₹${it.lineTotal || it.unitPrice}` : "";
            const msg = it.cakeMessage ? ` [Msg: "${it.cakeMessage}"]` : "";
            return `${cakeName}${variant}${eggless} x${qty}${price}${msg}`;
          })
          .join(" | ");
      }

      const orderIsCod = isCodOrder(o);
      const paymentMethodLabel = orderIsCod ? "Cash on Delivery (COD)" : `GPay / Online (${o.paymentMethod || "UPI / Razorpay"})`;

      const tax = Number(o.taxAmount || 0);
      const halfTax = (tax / 2).toFixed(2);
      const subtotal = Number(o.subtotal || 0).toFixed(2);
      const deliveryFee = Number(o.deliveryFee || 0).toFixed(2);
      const totalAmount = Number(o.totalAmount || 0).toFixed(2);

      const formattedOrderDate = o.createdAt
        ? new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        : "";

      const formattedDeliveredAt = o.deliveredAt
        ? new Date(o.deliveredAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        : "";

      return [
        o.orderNumber,
        formattedOrderDate,
        o.customerName,
        o.customerPhone,
        o.customerEmail,
        o.streetAddress,
        o.city,
        o.pincode,
        o.deliveryDate || "",
        o.deliveryTimeSlot || "",
        o.status,
        paymentMethodLabel,
        o.paymentStatus,
        itemsSummary,
        String(totalQty || o.items?.length || 0),
        o.hasEgglessItems ? "Yes" : "No",
        o.cakeMessage || "",
        o.specialInstructions || o.deliveryNotes || "",
        subtotal,
        halfTax,
        halfTax,
        tax.toFixed(2),
        deliveryFee,
        totalAmount,
        o.deliveryPartnerName || "",
        o.deliveryPartnerPhone || "",
        formattedDeliveredAt,
      ];
    });

    // Executive Financial Analysis Summary Rows for the bottom of the spreadsheet
    const summaryRows: string[][] = [
      [],
      ["=== MONTHLY FINANCIAL & SALES ANALYSIS SUMMARY ==="],
      ["Report Timeline / Period:", `${timelineLabel} (${monthName} ${year})`],
      ["Total Orders Placed:", String(salesStats.totalOrdersCount)],
      ["Orders Delivered:", String(salesStats.deliveredCount)],
      ["Orders In Progress / Delivery:", String(salesStats.pendingDeliveryCount)],
      ["Active Orders (Excl. Cancelled):", String(salesStats.activeOrdersCount)],
      ["Cancelled Orders:", String(salesStats.cancelledCount)],
      ["Total Cash on Delivery (COD) Revenue (₹):", salesStats.codAmount.toFixed(2)],
      ["Total Cash on Delivery (COD) Orders Count:", String(salesStats.codCount)],
      ["Total GPay / Online Payment Revenue (₹):", salesStats.gpayAmount.toFixed(2)],
      ["Total GPay / Online Orders Count:", String(salesStats.gpayCount)],
      ["Total Subtotal / Taxable Base (₹):", salesStats.totalSubtotal.toFixed(2)],
      ["Total SGST (2.5%) (₹):", (salesStats.totalGst / 2).toFixed(2)],
      ["Total CGST (2.5%) (₹):", (salesStats.totalGst / 2).toFixed(2)],
      ["Total GST Collected (5%) (₹):", salesStats.totalGst.toFixed(2)],
      ["Total Delivery Fees (₹):", salesStats.totalDeliveryFee.toFixed(2)],
      ["GRAND TOTAL REVENUE (₹):", salesStats.totalAmount.toFixed(2)],
      ["Report Generated At:", new Date().toLocaleString("en-IN")],
    ];

    const csvLines = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
      ...summaryRows.map((row) => row.map(escapeCsv).join(",")),
    ];

    const BOM = "\uFEFF"; // UTF-8 Byte Order Mark for Microsoft Excel
    const blob = new Blob([BOM + csvLines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Product Helpers
  function handleAddVariantRow() {
    setVariants([
      ...variants,
      { name: "1.5kg", price: 1250, weightValue: 1.5, weightUnit: "kg", isEggless: true, serves: "12-14 Servings", offer: "", isOffer1kgFree: false },
    ]);
  }

  function handleRemoveVariantRow(index: number) {
    if (variants.length <= 1) {
      alert("At least one price variation is required.");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  }

  function handleVariantChange(index: number, field: keyof VariantInput, value: any) {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  }

  function handleOpenCreateModal() {
    setEditingProduct(null);
    setName("");
    setCategorySlug("cakes");
    setSubCategory("Normal Flavors");
    setCustomSubCategory("");
    setDescription("");
    setImageName("signature.cake.1");
    setImage("");
    setImagePreview("");
    setImageError(null);
    setSelectedFile(null);
    setImageMeta(null);
    setBadge("");
    setEgglessAvailable(true);
    setHasOffer(false);
    setOfferBadge("1kg Free Offer");
    setOfferBuyVariant("1kg");
    setOfferFreeVariant("0.5kg");
    setVariants([
      { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", offer: "", isOffer1kgFree: false },
      { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", offer: "", isOffer1kgFree: false },
    ]);
    setShowAddModal(true);
  }

  function handleEditClick(p: ProductAdmin) {
    setEditingProduct(p);
    setName(p.name || "");
    setCategorySlug(p.category || "cakes");
    setSubCategory(p.subCategory || "Normal Flavors");
    setDescription(p.description || "");
    setImageName(p.imageName || "signature.cake.1");
    setBadge(p.badge || "");

    const isBento = (p.category || "").toLowerCase().includes("bento");
    setEgglessAvailable(p.egglessAvailable !== undefined ? Boolean(p.egglessAvailable) : (isBento ? false : true));

    const existingImg = p.image || (p.imageName && (p.imageName.startsWith("data:") || p.imageName.startsWith("http") || p.imageName.startsWith("/")) ? p.imageName : "");
    setImage(existingImg || "");
    setImagePreview(existingImg || "");
    setImageError(null);
    setSelectedFile(null);
    setImageMeta(null);

    const activeOffer = p.offers?.find((o) => o.isActive);
    const isOffer = Boolean(activeOffer || p.isOfferProduct || (p.badge || "").includes("1kg Free") || (p.badge || "").includes("Offer"));
    setHasOffer(isOffer);
    setOfferBadge(p.badge || "1kg Free Offer");

    if (p.variants && p.variants.length > 0) {
      const buyVar = p.variants.find((v) => v.name.includes("1kg") || v.isOffer1kgFree) || p.variants[0];
      const freeVar = p.variants.find((v) => v.name.includes("0.5kg") || v.name.includes("500g")) || p.variants[0];
      setOfferBuyVariant(buyVar.name);
      setOfferFreeVariant(freeVar.name);
    }

    setVariants(
      p.variants && p.variants.length > 0
        ? p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          weightValue: v.weightValue,
          weightUnit: v.weightUnit,
          isEggless: v.isEggless,
          serves: v.serves,
          offer: v.offer || "",
          isOffer1kgFree: v.isOffer1kgFree,
        }))
        : [
          {
            name: "Regular",
            price: typeof p.price === "number" ? p.price : 450,
            weightValue: 0.5,
            weightUnit: "kg",
            isEggless: true,
            serves: "4-6 Servings",
            offer: "",
            isOffer1kgFree: false,
          },
        ]
    );
    setShowAddModal(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const isMimeValid = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase());
    const isExtValid = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!isMimeValid && !isExtValid) {
      setImageError("Please upload a valid image file (JPG, JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size === 0) {
      setImageError("The selected image file is empty. Please choose a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError("Image file is too large. Maximum allowed size is 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setImageError("Failed to read image file. Please try another image.");
    };
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        setImageError("Failed to load image. Please try again.");
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setImage(rawDataUrl);
        setImagePreview(rawDataUrl);
        setSelectedFile(file);
      };
      img.onload = () => {
        try {
          // Downscale & optimize dimensions (max 1000px)
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setImage(rawDataUrl);
            setImagePreview(rawDataUrl);
            setSelectedFile(file);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP format
          const webpDataUrl = canvas.toDataURL("image/webp", 0.85);
          setImage(webpDataUrl);
          setImagePreview(webpDataUrl);

          // Generate optimized WebP File for Cloudflare R2 upload
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const safeBase = file.name
                  .replace(/\.[^/.]+$/, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]+/g, "-") || "cake";
                const webpFile = new File([blob], `${safeBase}-${Date.now()}.webp`, {
                  type: "image/webp",
                });
                setSelectedFile(webpFile);
                setImageMeta({
                  width,
                  height,
                  originalSizeKb: Math.round(file.size / 1024),
                  webpSizeKb: Math.round(blob.size / 1024),
                });
              } else {
                setSelectedFile(file);
              }
            },
            "image/webp",
            0.85
          );
        } catch {
          setImage(rawDataUrl);
          setImagePreview(rawDataUrl);
          setSelectedFile(file);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImage("");
    setImagePreview("");
    setImageError(null);
    setSelectedFile(null);
    setImageMeta(null);
  }

  async function handleToggleSales(id: string, currentActive: boolean) {
    updateCakeInLocalStorage(id, { isActive: !currentActive });
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, isActive: !currentActive } : p))
    );
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage(`Product sales status updated.`);
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  }

  async function handleDeleteProduct(id: string, nameStr: string) {
    if (!confirm(`Are you sure you want to delete "${nameStr}"?`)) return;
    deleteCakeFromLocalStorage(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    setAlertMessage(`Deleted "${nameStr}" successfully.`);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("API delete notice:", err);
    }
    fetchProducts();
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const isCakeCategory = ["cakes", "bento-cake", "wedding-cakes", "first-birthday", "custom-cake"].includes(categorySlug);
      const finalEgglessAvailable = isCakeCategory ? egglessAvailable : false;

      const updatedVariants = variants.map((v) => ({
        ...v,
        offer: isCakeCategory ? (v.offer || "").trim() : undefined,
        isOffer1kgFree: false,
      }));

      const productId = editingProduct ? editingProduct.id : String(Date.now());
      const slug = editingProduct
        ? editingProduct.slug
        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "cake";
      const productCode = editingProduct
        ? editingProduct.productCode
        : `LOL-${Math.floor(1000 + Math.random() * 9000)}`;

      const resolvedSubCategory =
        categorySlug === "cakes" && subCategory === "__NEW__" ? customSubCategory : subCategory;
      const categoryObj = PRIMARY_CATEGORIES.find((c) => c.slug === categorySlug);
      const categoryName = categoryObj ? categoryObj.name : categorySlug;

      let finalImage = image || (editingProduct ? editingProduct.image : undefined);

      // Upload to server storage in PRODUCT_IMAGES / Cloudflare R2 if a new file was chosen
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("category", categorySlug);

          // Pass previous image URL and product ID so previous R2 image is deleted upon replacement
          if (editingProduct) {
            const prevImg = editingProduct.imageName || editingProduct.image;
            if (prevImg) {
              formData.append("previousImageUrl", prevImg);
            }
            if (editingProduct.id) {
              formData.append("productId", String(editingProduct.id));
            }
          }

          const uploadRes = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.success && uploadData.imageUrl) {
            finalImage = uploadData.imageUrl;
          }
        } catch (uploadErr) {
          console.warn("Server upload notice, using client image representation:", uploadErr);
        }
      }

      const cakeRecord: ProductAdmin = {
        id: productId,
        slug,
        productCode,
        name,
        category: categorySlug,
        categoryName,
        subCategory: resolvedSubCategory,
        description,
        imageName: finalImage || imageName || "signature.cake.1",
        image: finalImage || undefined,
        badge: badge || undefined,
        rating: editingProduct?.rating || 5.0,
        reviewCount: editingProduct?.reviewCount || 1,
        productType: categorySlug === "snacks" ? "SNACK" : "CAKE",
        isActive: editingProduct ? editingProduct.isActive : true,
        egglessAvailable: finalEgglessAvailable,
        variants: updatedVariants,
        offers: [],
        price: updatedVariants[0]?.price || 0,
      };

      // Persist in browser localStorage under "cakes"
      saveCakeToLocalStorage(cakeRecord);

      let payloadImageName = finalImage || imageName || "signature.cake.1";
      if (payloadImageName.startsWith("data:")) {
        const subDir = categorySlug === "snacks" ? "Snacks" : "cakes";
        payloadImageName = `/PRODUCT_IMAGES/${subDir}/cake-${Date.now()}.jpg`;
      }

      const payload = {
        name,
        categorySlug,
        subCategory: resolvedSubCategory,
        description,
        imageName: payloadImageName,
        badge,
        productType: categorySlug === "snacks" ? "SNACK" : "CAKE",
        isActive: true,
        egglessAvailable: finalEgglessAvailable,
        variants: updatedVariants,
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (!editingProduct && data.productId) {
            updateCakeInLocalStorage(productId, { id: String(data.productId), slug: data.slug || slug });
          }
        }
      } catch (apiErr) {
        console.warn("API save notice:", apiErr);
      }

      setAlertMessage(editingProduct ? "Product updated successfully." : "Product saved successfully.");
      setShowAddModal(false);
      fetchProducts();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, newStatus: string) {
    try {
      // Optimistically update order status in state for snappy UI
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
      );
      setSalesOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
      );

      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage("Order status updated.");
        fetchOrders(ordersDateFilter, activeSearchQuery);
        fetchSalesOrders(salesDateFilter);
      }
    } catch (err) {
      alert("Failed to update order status.");
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pName = (p.name || "").toLowerCase();
      const pSlug = (p.slug || "").toLowerCase();
      const pCode = (p.productCode || "").toLowerCase();
      const q = searchTerm.toLowerCase();

      const matchesSearch = pName.includes(q) || pSlug.includes(q) || pCode.includes(q);

      const matchesCat =
        selectedCategoryFilter === "all" ||
        p.category === selectedCategoryFilter ||
        p.subCategory === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategoryFilter]);

  if (!isMounted || checkingAuth) {
    return (
      <div className="min-h-screen bg-[#250527] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#E6C184] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-[#E6C184] tracking-widest uppercase">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (UNAUTHENTICATED VIEW)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C061E] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-md w-full bg-[#2A082C] rounded-2xl sm:rounded-3xl border border-[#962854]/40 p-5 sm:p-8 shadow-2xl space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#802B52]/40 border border-[#E6C184]/40 flex items-center justify-center mx-auto text-2xl sm:text-3xl shadow-lg">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#E6C184]">lock</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              Lollipop Admin Portal
            </h1>
            <p className="text-xs text-[#D8C3B3]">
              Sign in to manage your cake shop catalog and orders
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3.5 text-xs text-red-200 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-[#E6C184] mb-1.5 tracking-wider">
                Admin Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter admin email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-3 bg-[#1C061E] border border-[#962854]/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6C184] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#E6C184] mb-1.5 tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#1C061E] border border-[#962854]/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6C184] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#802B52] hover:bg-[#962854] text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-pink-900/30 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {loggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2D2327]">
      {/* Admin Navbar Header */}
      <header className="bg-[#2A082C] border-b border-[#962854]/40 text-white px-4 sm:px-8 py-3.5 sm:py-4 shadow-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#802B52] flex items-center justify-center text-lg sm:text-xl shadow-md border border-[#E6C184]/30 shrink-0">
                <span className="material-symbols-outlined text-lg sm:text-xl text-[#E6C184]">bakery_dining</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg sm:text-2xl text-white tracking-wide leading-tight">
                  Lollipop Admin
                </h1>
                <p className="text-[11px] sm:text-xs text-[#D8C3B3]">
                  Logged in as <strong className="text-white">{adminUser?.fullName}</strong>
                </p>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white text-xs p-2 rounded-lg transition-all border border-white/20 flex items-center justify-center"
                title="View Storefront"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/40 text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center"
                title="Logout"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start md:justify-end border-t border-white/10 pt-2.5 md:pt-0 md:border-t-0">
            {adminUser?.role === "SUPERADMIN" && (
              <button
                onClick={handleOpenCreateModal}
                className="flex-1 sm:flex-initial bg-[#E6C184] hover:bg-[#d8b070] text-[#2A082C] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <span>+ Add Product</span>
              </button>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all border border-white/20 items-center gap-1.5"
            >
              <span>View Storefront</span>
            </a>

            <button
              onClick={handleLogout}
              className="hidden md:flex bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/40 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer items-center gap-1"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {alertMessage && (
          <div className="bg-[#802B52] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl flex justify-between items-center text-xs sm:text-sm shadow-md">
            <span>{alertMessage}</span>
            <button onClick={() => setAlertMessage(null)} className="font-bold text-xs hover:opacity-80 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Admin Dashboard Tabs */}
        <div className="flex border-b border-[#E6DBCE] space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTab === "sales"
                ? "border-[#802B52] text-[#802B52] bg-[#FAF5EE]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
              }`}
          >
            <span className="inline">Sales &amp; Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTab === "products"
                ? "border-[#802B52] text-[#802B52] bg-[#FAF5EE]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
              }`}
          >
            <span className="inline">Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTab === "orders"
                ? "border-[#802B52] text-[#802B52] bg-[#FAF5EE]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
              }`}
          >
            <span className="inline">Orders ({orders.length})</span>
          </button>

          {adminUser?.role === "SUPERADMIN" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTab === "users"
                  ? "border-[#802B52] text-[#802B52] bg-[#FAF5EE]"
                  : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
                }`}
            >
              <span className="inline">Admins ({adminUsersList.length})</span>
            </button>
          )}
        </div>

        {/* TAB 1: SALES & OVERVIEW */}
        {activeTab === "sales" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Sales Overview Header & Timeline Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-[#E6DBCE] shadow-sm">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5B1E38]">
                  Sales &amp; Revenue Overview
                </h2>
                <p className="text-xs text-[#7A6B72]">
                  Track orders, Cash on Delivery, GPay, and total revenue across selected timelines
                </p>
              </div>

              {/* Date Filter Bar & Excel Download */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap items-center gap-1 bg-[#FAF5EE] p-1.5 rounded-xl border border-[#E6DBCE]">
                  {(["today", "yesterday", "7days", "month", "all"] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => handleSalesDateChange(filterKey)}
                      disabled={salesLoading}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer flex-1 sm:flex-initial text-center disabled:opacity-50 ${salesDateFilter === filterKey
                          ? "bg-[#802B52] text-white shadow-sm"
                          : "text-[#7A6B72] hover:bg-[#E6DBCE]/50"
                        }`}
                    >
                      {filterKey === "today"
                        ? "Today"
                        : filterKey === "yesterday"
                          ? "Yesterday"
                          : filterKey === "7days"
                            ? "7 Days"
                            : filterKey === "month"
                              ? "Month"
                              : "All"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportOrdersExcel}
                  disabled={salesOrders.length === 0}
                  className="px-3.5 py-2 bg-[#802B52] hover:bg-[#962854] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  title="Download Excel Spreadsheet with full monthly analysis"
                >
                  <span>Export Excel ({salesOrders.length})</span>
                </button>
              </div>
            </div>

            {/* Sales Stat Cards Grid (4 boxes: 1. Number of Orders & Delivered, 2. Cash on Delivery, 3. GPay, 4. Total Amount) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {/* Box 1: Number of Orders & Delivered Orders */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6DBCE] shadow-sm hover:shadow-md hover:border-[#802B52]/30 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                    Number of Orders
                  </span>
                  <span className="material-symbols-outlined text-base text-[#7A6B72]">inventory_2</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#2A082C]">
                  {salesStats.totalOrdersCount} <span className="text-xs sm:text-base font-normal text-gray-500">Orders</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {salesStats.deliveredCount} Delivered
                  </span>
                  {salesStats.pendingDeliveryCount > 0 && (
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {salesStats.pendingDeliveryCount} In Delivery
                    </span>
                  )}
                  {salesStats.cancelledCount > 0 && (
                    <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200">
                      {salesStats.cancelledCount} Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Box 2: Cash on Delivery */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6DBCE] shadow-sm hover:shadow-md hover:border-[#802B52]/30 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                    Cash on Delivery
                  </span>
                  <span className="material-symbols-outlined text-base text-[#7A6B72]">payments</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#962854] truncate">
                  ₹{salesStats.codAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md inline-block border border-amber-200">
                  {salesStats.codCount} COD Orders
                </p>
              </div>

              {/* Box 3: GPay */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6DBCE] shadow-sm hover:shadow-md hover:border-[#802B52]/30 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                    GPay
                  </span>
                  <span className="material-symbols-outlined text-base text-[#7A6B72]">phone_iphone</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-indigo-700 truncate">
                  ₹{salesStats.gpayAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] sm:text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md inline-block border border-indigo-200">
                  {salesStats.gpayCount} GPay / Online Paid
                </p>
              </div>

              {/* Box 4: Total Amount */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6DBCE] shadow-sm hover:shadow-md hover:border-[#802B52]/30 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                    Total Amount
                  </span>
                  <span className="material-symbols-outlined text-base text-[#7A6B72]">account_balance_wallet</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#802B52] truncate">
                  ₹{salesStats.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200">
                  ✓ All Payment Methods
                </p>
              </div>
            </div>

            {/* Sales Orders & Payment Analysis Table */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#E6DBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#5B1E38]">
                    Orders &amp; Payment Analysis ({salesOrders.length})
                  </h3>
                  <p className="text-xs text-[#7A6B72]">
                    Showing {salesStats.totalOrdersCount} orders ({salesStats.deliveredCount} Delivered): {salesStats.codCount} Cash on Delivery (₹{salesStats.codAmount.toLocaleString("en-IN")}) and {salesStats.gpayCount} GPay / Online (₹{salesStats.gpayAmount.toLocaleString("en-IN")})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportOrdersExcel}
                    disabled={salesOrders.length === 0}
                    className="px-3.5 py-1.5 bg-[#FAF5EE] hover:bg-[#E6DBCE] text-[#5B1E38] border border-[#E6DBCE] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <span>Download Excel Sheet</span>
                  </button>
                  <div className="text-right">
                    <span className="text-xs text-[#7A6B72]">Total: </span>
                    <span className="font-extrabold text-base text-[#802B52]">
                      ₹{salesStats.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {salesOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#7A6B72]">
                  No orders recorded for the selected timeline.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4">Delivery Partner</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DBCE]">
                      {salesOrders.map((o) => {
                        const orderIsCod = isCodOrder(o);
                        return (
                          <tr key={o.id} className="hover:bg-[#FDFBF7]">
                            <td className="py-3 px-4 font-mono font-bold text-[#802B52]">
                              {o.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#2D2327]">{o.customerName}</div>
                              <div className="text-[11px] text-[#7A6B72]">{o.customerPhone}</div>
                            </td>
                            <td className="py-3 px-4">
                              {orderIsCod ? (
                                <span className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
                                  Cash on Delivery
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-[11px] text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                  GPay / Online ({o.paymentStatus || "PAID"})
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {o.status === "DELIVERED" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                                  Delivered
                                </span>
                              ) : o.status === "CANCELLED" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-[11px] text-red-800 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-[11px] text-[#802B52] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded">
                                  {o.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {o.deliveryPartnerName ? (
                                <div>
                                  <span className="font-semibold text-[#5B1E38]">{o.deliveryPartnerName}</span>
                                  {o.deliveryPartnerPhone && (
                                    <div className="text-[10px] text-[#7A6B72]">{o.deliveryPartnerPhone}</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic text-[11px]">Direct Bakery</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[#7A6B72]">
                              {o.deliveryDate || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "")}
                            </td>
                            <td className="py-3 px-4 font-extrabold text-[#802B52] text-right">
                              ₹{o.totalAmount}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderModal(o)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#E6DBCE] text-[#5B1E38] border border-[#E6DBCE] rounded text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="w-full sm:w-auto flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm bg-white font-medium focus:outline-none focus:border-[#802B52]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {PRIMARY_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchProducts}
                  className="px-3 py-2.5 rounded-xl border border-[#E6DBCE] bg-[#FAF5EE] hover:bg-[#f2e7d8] text-xs font-bold text-[#802B52] transition-all cursor-pointer shrink-0"
                >
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-[#7A6B72]">
                No products found matching your filter.
              </div>
            ) : (
              <>
                {/* MOBILE CARD VIEW FOR PRODUCTS (Visible on screens < 768px) */}
                <div className="block md:hidden space-y-3.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-[#E6DBCE] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm hover:shadow-md hover:border-[#802B52]/40 transition-all"
                    >
                      {/* Card Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E6DBCE]/70">
                        <span className="font-mono text-xs font-bold text-[#802B52] bg-[#FAF5EE] border border-[#E6DBCE] px-2.5 py-1 rounded-lg">
                          {p.productCode}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.isActive
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                          {p.isActive ? "● Active" : "○ Paused"}
                        </span>
                      </div>

                      {/* Product Info with Image */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E6DBCE] bg-[#FAF5EE] shrink-0 shadow-inner">
                          {p.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={p.image}
                              alt={p.name || "Cake"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="material-symbols-outlined text-2xl">cake</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-[#2D2327] truncate leading-snug">{p.name}</h3>
                          <p className="text-xs font-medium text-[#802B52] truncate mt-0.5">
                            {p.categoryName || p.category || "Cakes"}
                          </p>
                        </div>
                      </div>

                      {/* Variants & Prices Chips */}
                      <div className="bg-[#FAF5EE]/50 border border-[#E6DBCE]/60 rounded-xl p-2.5">
                        <p className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider mb-1.5">Variants &amp; Pricing</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(p.variants || []).map((v, i) => (
                            <span
                              key={i}
                              className="bg-white border border-[#E6DBCE] text-[#2D2327] font-semibold px-2 py-0.5 rounded-lg text-[11px] shadow-2xs"
                            >
                              {v.name}: <strong className="text-[#802B52]">₹{v.price}</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E6DBCE]/70">
                        <button
                          onClick={() => handleToggleSales(p.id, p.isActive)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${p.isActive
                              ? "border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 active:bg-amber-200"
                              : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200"
                            }`}
                        >
                          {p.isActive ? "Pause Sales" : "Resume Sales"}
                        </button>

                        {adminUser?.role === "SUPERADMIN" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#802B52] hover:bg-[#962854] text-white transition-all shadow-sm cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer shadow-sm flex items-center justify-center"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-base leading-none">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP TABLE VIEW FOR PRODUCTS (Visible on screens >= 768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Variants &amp; Pricing</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DBCE]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FDFBF7]">
                          <td className="py-4 px-4 font-mono font-bold text-[#802B52]">{p.productCode}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              {p.image && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={p.image}
                                  alt={p.name || "Cake"}
                                  className="w-8 h-8 rounded-lg object-cover border border-[#E6DBCE] flex-shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              )}
                              <div className="font-bold text-sm text-[#2D2327]">{p.name}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-[#5B1E38]">{p.categoryName || p.category || "Cakes"}</td>
                          <td className="py-4 px-4">
                            {(p.variants || []).map((v, i) => (
                              <span key={i} className="inline-block bg-[#FAF5EE] border border-[#E6DBCE] text-[#2D2327] font-semibold px-2 py-0.5 rounded text-[11px] mr-1.5 mb-1">
                                {v.name}: ₹{v.price}
                              </span>
                            ))}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {p.isActive ? "Active for Sales" : "Sales Paused"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleSales(p.id, p.isActive)}
                                className={`px-3 py-1.5 rounded text-[11px] font-semibold border cursor-pointer ${p.isActive ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100" : "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"}`}
                              >
                                {p.isActive ? "Pause Sales" : "Resume Sales"}
                              </button>
                              {adminUser?.role === "SUPERADMIN" && (
                                <>
                                  <button
                                    onClick={() => handleEditClick(p)}
                                    className="px-3 py-1.5 rounded text-[11px] font-semibold bg-[#802B52] text-white hover:bg-[#682242] cursor-pointer"
                                  >
                                    Edit Item
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    className="px-2.5 py-1.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer flex items-center justify-center"
                                  >
                                    <span className="material-symbols-outlined text-base leading-none">delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header & Controls for Orders */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#5B1E38]">
                      Customer Orders
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#802B52]/10 text-[#802B52] border border-[#802B52]/20">
                      {activeSearchQuery
                        ? `${orders.length} found`
                        : ordersDateFilter === "today"
                          ? `${orders.length} Today`
                          : `${orders.length} in period`}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6B72] mt-0.5">
                    {activeSearchQuery
                      ? `Showing database search matches for "${activeSearchQuery}".`
                      : ordersDateFilter === "today"
                        ? "Showing today's orders by default. Search by name, order ID, or phone to query any order in the database."
                        : `Showing orders for: ${ordersDateFilter}.`}
                  </p>
                </div>

                <button
                  onClick={() => fetchOrders(ordersDateFilter, activeSearchQuery)}
                  disabled={ordersLoading}
                  className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#F3E8DB] cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${ordersLoading ? "animate-spin" : ""}`}>refresh</span>
                  <span>{ordersLoading ? "Fetching..." : "Refresh"}</span>
                </button>
              </div>

              {/* On-Demand Database Search & Date Filter Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-[#E6DBCE]/60">
                {/* On-Demand Database Search Form */}
                <form onSubmit={handleSearchOrders} className="flex-1 flex items-center gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7A6B72]">
                      search
                    </span>
                    <input
                      type="text"
                      value={ordersSearchInput}
                      onChange={(e) => setOrdersSearchInput(e.target.value)}
                      placeholder="Search by User Name, Mobile No, or Order ID..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#E6DBCE] bg-white text-xs sm:text-sm text-[#2D2327] placeholder:text-[#A19199] focus:outline-none focus:border-[#802B52] focus:ring-1 focus:ring-[#802B52]"
                    />
                    {ordersSearchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setOrdersSearchInput("");
                          if (activeSearchQuery) handleClearSearch();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                        title="Clear input"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={ordersLoading}
                    className="px-4 py-2.5 rounded-xl bg-[#802B52] hover:bg-[#962854] text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {ordersLoading && activeSearchQuery ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">search</span>
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Date Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF5EE] p-1.5 rounded-xl border border-[#E6DBCE] shrink-0">
                  {(
                    [
                      { key: "today", label: "Today" },
                      { key: "yesterday", label: "Yesterday" },
                      { key: "7days", label: "Last 7 Days" },
                      { key: "month", label: "This Month" },
                      { key: "all", label: "All Orders" },
                    ] as const
                  ).map(({ key, label }) => {
                    const isActive = !activeSearchQuery && ordersDateFilter === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectOrdersDateFilter(key)}
                        disabled={ordersLoading}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${isActive
                            ? "bg-[#802B52] text-white shadow-sm"
                            : "text-[#7A6B72] hover:bg-[#E6DBCE]/60 hover:text-[#2D2327]"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Search Banner */}
              {activeSearchQuery && (
                <div className="flex items-center justify-between gap-3 bg-purple-50 border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#5B1E38]">
                    <span className="material-symbols-outlined text-sm text-[#802B52]">search</span>
                    <span>
                      Database query results for:{" "}
                      <strong className="text-[#802B52] bg-white px-2 py-0.5 rounded border border-purple-200">
                        &quot;{activeSearchQuery}&quot;
                      </strong>{" "}
                      ({orders.length} {orders.length === 1 ? "order" : "orders"} found)
                    </span>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="px-2.5 py-1 rounded-lg bg-white border border-purple-300 hover:bg-purple-100 text-[#802B52] font-bold text-[11px] transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    ✕ Clear &amp; Show Today
                  </button>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-[#7A6B72] font-serif space-y-2">
                <div>
                  <span className="material-symbols-outlined text-3xl text-[#7A6B72]">inventory_2</span>
                </div>
                <p className="font-semibold text-sm text-[#2D2327]">
                  {activeSearchQuery
                    ? `No orders found matching "${activeSearchQuery}".`
                    : ordersDateFilter === "today"
                      ? "No orders recorded for today yet."
                      : `No orders found for the selected period (${ordersDateFilter}).`}
                </p>
                {activeSearchQuery ? (
                  <button
                    onClick={handleClearSearch}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#E6DBCE] text-xs font-bold cursor-pointer"
                  >
                    ✕ Clear Search &amp; Return to Today
                  </button>
                ) : ordersDateFilter !== "all" ? (
                  <button
                    onClick={() => handleSelectOrdersDateFilter("all")}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#E6DBCE] text-xs font-bold cursor-pointer"
                  >
                    View All Orders Instead
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                {/* MOBILE CARD VIEW FOR ORDERS (Visible on screens < 768px) */}
                <div className="block md:hidden space-y-3.5">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white border border-[#E6DBCE] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm hover:shadow-md hover:border-[#802B52]/40 transition-all"
                    >
                      {/* Card Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E6DBCE]/70">
                        <span className="font-mono text-xs font-bold text-[#802B52] bg-[#FAF5EE] border border-[#E6DBCE] px-2.5 py-1 rounded-lg">
                          {o.orderNumber}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-[#7A6B72] block font-medium uppercase">Total</span>
                          <span className="font-extrabold text-base text-[#802B52]">
                            ₹{o.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Delivery Schedule Grid */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-[#FAF5EE]/50 border border-[#E6DBCE]/60 rounded-xl p-2.5">
                          <p className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider">Customer</p>
                          <p className="font-bold text-[#2D2327] mt-0.5 truncate">{o.customerName}</p>
                          {o.customerPhone && (
                            <a href={`tel:${o.customerPhone}`} className="text-[#802B52] font-semibold text-[11px] hover:underline block mt-0.5">
                              {o.customerPhone}
                            </a>
                          )}
                          <p className="text-[10px] text-[#7A6B72] mt-1 line-clamp-2">{o.streetAddress}, {o.city} - {o.pincode}</p>
                        </div>

                        <div className="bg-[#FAF5EE]/50 border border-[#E6DBCE]/60 rounded-xl p-2.5">
                          <p className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider">Delivery Schedule</p>
                          <p className="font-bold text-[#5B1E38] mt-0.5">{o.deliveryDate}</p>
                          <p className="text-[11px] font-bold text-[#802B52] mt-0.5">{o.deliveryTimeSlot}</p>
                        </div>
                      </div>

                      {/* Items & Details Clickable Box (Only Cake Count) */}
                      <div className="bg-[#FAF5EE]/60 border border-[#E6DBCE] rounded-xl p-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderModal(o)}
                          className="w-full text-left flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider block">Items &amp; Details</span>
                            <span className="font-extrabold text-sm text-[#1C0D0A] group-hover:text-[#802B52] block mt-0.5">
                              {(() => {
                                const count = o.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || o.items?.length || 0;
                                return `${count} ${count === 1 ? "Cake" : "Cakes"}`;
                              })()}
                            </span>
                            <span className="text-[11px] text-[#802B52] font-semibold underline block mt-0.5">
                              Tap to view items &amp; remarks
                            </span>
                            {(o.specialInstructions || o.deliveryNotes || o.cakeMessage) && (
                              <span className="text-[9.5px] font-bold text-[#802B52] bg-[#FAF0F2] border border-[#802B52]/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                                Remarks/Notes attached
                              </span>
                            )}
                          </div>
                          <span className="material-symbols-outlined text-xl text-[#802B52] group-hover:translate-x-0.5 transition-transform">
                            open_in_new
                          </span>
                        </button>
                      </div>

                      {/* Delivery Rider & OTP Details */}
                      <div className="bg-[#FAF5EE]/50 border border-[#E6DBCE]/60 rounded-xl p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#7A6B72]">Delivery Partner:</span>
                          {o.status === "DELIVERED" ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              Delivered {o.deliveryPartnerName ? `by ${o.deliveryPartnerName}` : ""}
                            </span>
                          ) : o.deliveryPartnerName ? (
                            <span className="text-xs font-bold text-[#5B1E38] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              {o.status === "OUT_FOR_DELIVERY" ? "Out for Delivery: " : ""}{o.deliveryPartnerName}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Open to all delivery partners</span>
                          )}
                        </div>

                        {o.deliveryPartnerPhone && (
                          <div className="text-[11px] text-[#7A6B72]">
                            Phone: <a href={`tel:${o.deliveryPartnerPhone}`} className="font-semibold text-[#2D2327] hover:underline">{o.deliveryPartnerPhone}</a>
                          </div>
                        )}

                        {o.deliveredAt && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Delivered at: {new Date(o.deliveredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}

                        {o.deliveryOtp && (
                          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#E6DBCE]/60">
                            <span className="text-[#7A6B72] font-medium">Delivery OTP:</span>
                            <span className="font-mono font-bold text-[#802B52] bg-white border border-[#E6DBCE] px-2.5 py-0.5 rounded-lg shadow-2xs">
                              {o.deliveryOtp} {o.deliveryOtpVerified && "✓"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer / Status Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#E6DBCE]/70">
                        <span className="text-xs font-bold uppercase text-[#7A6B72]">Order Status:</span>
                        {adminUser?.role === "SUPERADMIN" ? (
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-[#E6DBCE] bg-white text-xs font-bold text-[#2D2327] focus:outline-none focus:border-[#802B52] shadow-sm cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#802B52] text-white shadow-sm">
                            {o.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP TABLE VIEW FOR ORDERS */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Delivery Schedule</th>
                        <th className="py-3 px-4">Items &amp; Details</th>
                        <th className="py-3 px-4">Delivery Partner</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DBCE]">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#FDFBF7]">
                          <td className="py-4 px-4 font-mono font-bold text-[#802B52]">
                            {o.orderNumber}
                            {o.deliveryOtp && (
                              <div className="mt-1 font-mono text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block">
                                OTP: {o.deliveryOtp}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#2D2327]">{o.customerName}</div>
                            <div className="text-[11px] text-[#7A6B72]">{o.customerPhone}</div>
                            <div className="text-[11px] text-[#7A6B72]">{o.customerEmail}</div>
                            <div className="text-[10px] text-[#7A6B72] mt-1 line-clamp-1">{o.streetAddress}, {o.city}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-[#5B1E38]">{o.deliveryDate}</div>
                            <div className="text-[11px] font-bold text-[#802B52] mt-0.5">{o.deliveryTimeSlot}</div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderModal(o)}
                              className="px-3.5 py-2 rounded-xl border border-[#E6DBCE] bg-[#FAF5EE] hover:bg-[#F3E8DC] hover:border-[#802B52]/40 text-left flex items-center justify-between gap-3 shadow-2xs group cursor-pointer transition-all w-full max-w-[210px]"
                              title="Click to view full products ordered, cake remarks and customer texted details"
                            >
                              <div>
                                <span className="font-extrabold text-xs block text-[#1C0D0A] group-hover:text-[#802B52]">
                                  {(() => {
                                    const count = o.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || o.items?.length || 0;
                                    return `${count} ${count === 1 ? "Cake" : "Cakes"}`;
                                  })()}
                                </span>
                                <span className="text-[10px] text-[#7A6B72] font-medium block">
                                  View items &amp; remarks
                                </span>
                                {(o.specialInstructions || o.deliveryNotes || o.cakeMessage) && (
                                  <span className="text-[9.5px] font-bold text-[#802B52] bg-[#FAF0F2] border border-[#802B52]/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                                    Remarks/Notes attached
                                  </span>
                                )}
                              </div>
                              <span className="material-symbols-outlined text-base text-[#802B52] transition-transform group-hover:translate-x-0.5">
                                open_in_new
                              </span>
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            {o.status === "DELIVERED" ? (
                              <div className="space-y-1">
                                <div className="font-bold text-emerald-800 text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                                  Delivered {o.deliveryPartnerName ? `by ${o.deliveryPartnerName}` : ""}
                                </div>
                                {o.deliveryPartnerPhone && (
                                  <div className="text-[10px] text-[#7A6B72]">{o.deliveryPartnerPhone}</div>
                                )}
                                {o.deliveredAt && (
                                  <div className="text-[9px] text-gray-500">
                                    {new Date(o.deliveredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                  </div>
                                )}
                              </div>
                            ) : o.deliveryPartnerName ? (
                              <div className="space-y-1">
                                <div className="font-bold text-[#5B1E38] text-[11px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                                  {o.status === "OUT_FOR_DELIVERY" ? "Out: " : ""}{o.deliveryPartnerName}
                                </div>
                                {o.deliveryPartnerPhone && (
                                  <div className="text-[10px] text-[#7A6B72]">{o.deliveryPartnerPhone}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">Open to all delivery partners</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#802B52]">₹{o.totalAmount}</td>
                          <td className="py-4 px-4">
                            {adminUser?.role === "SUPERADMIN" ? (
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="px-2 py-1 rounded border border-[#E6DBCE] bg-white text-xs font-semibold focus:outline-none focus:border-[#802B52]"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PREPARING">PREPARING</option>
                                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-[#2A082C] text-[#E6C184]">
                                {o.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: MANAGE ADMIN USERS */}
        {adminUser?.role === "SUPERADMIN" && activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#5B1E38]">
                  Admin Users
                </h2>
                <p className="text-xs text-[#7A6B72] hidden sm:block">
                  Manage your admin team and staff accounts.
                </p>
              </div>

              <button
                onClick={() => setShowUserModal(true)}
                className="bg-[#802B52] hover:bg-[#962854] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 shrink-0"
              >
                + <span className="hidden sm:inline">Create New Admin User</span><span className="sm:hidden">Add User</span>
              </button>
            </div>

            {/* MOBILE CARD VIEW FOR ADMIN & RIDER USERS */}
            <div className="block md:hidden space-y-3.5">
              {adminUsersList.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border border-[#E6DBCE] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm hover:shadow-md hover:border-[#802B52]/40 transition-all"
                >
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E6DBCE]/70">
                    <span className="font-bold text-sm sm:text-base text-[#2D2327] truncate">{u.fullName}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${u.role === "SUPERADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : u.role === "RIDER"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                    >
                      {u.role === "SUPERADMIN" ? "Super Admin" : u.role === "RIDER" ? "Delivery Rider" : "Admin"}
                    </span>
                  </div>

                  {/* Card Contact Details */}
                  <div className="bg-[#FAF5EE]/50 border border-[#E6DBCE]/60 rounded-xl p-3 space-y-1.5 text-xs">
                    <p className="font-mono text-xs font-semibold text-[#802B52]">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-[#5C524E]">
                        Phone: <a href={`tel:${u.phone}`} className="font-semibold text-[#1C0D0A] hover:underline">{u.phone}</a>
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between text-xs text-[#7A6B72] pt-3 border-t border-[#E6DBCE]/70">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-semibold text-emerald-800">Active</span>
                    </span>
                    <span className="font-medium">Created: {new Date(u.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW FOR ADMIN & RIDER USERS */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DBCE]">
                  {adminUsersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-4 px-4 font-bold text-[#2D2327]">{u.fullName}</td>
                      <td className="py-4 px-4 font-mono text-[#802B52]">{u.email}</td>
                      <td className="py-4 px-4 text-[#5C524E]">{u.phone || "—"}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${u.role === "SUPERADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "RIDER"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {u.role === "SUPERADMIN" ? "Super Admin" : u.role === "RIDER" ? "Delivery Rider (Mobile App Only)" : "Admin"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#7A6B72]">
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* CREATE NEW ADMIN / RIDER USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-2xl max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-5 text-[#2D2327] my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DBCE]">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#5B1E38]">
                Add User / Delivery Rider
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 p-1 text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-3.5 text-xs" autoComplete="off">
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rider@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Mobile Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Role &amp; Access Level *
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DBCE] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#802B52]"
                >
                  <option value="RIDER">Delivery Rider (Mobile App Only)</option>
                  <option value="ADMIN">Admin (Dashboard Access)</option>
                  <option value="SUPERADMIN">Super Admin (Full Access)</option>
                </select>
                {newAdminRole === "RIDER" && (
                  <p className="text-[11px] text-[#802B52] mt-1 bg-[#FAF0F2] p-2 rounded-lg border border-[#802B52]/20">
                    Delivery Riders are strictly restricted to the mobile app and cannot access this admin dashboard.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border border-[#E6DBCE] text-[#7A6B72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-[#802B52] hover:bg-[#962854] text-white shadow-md"
                >
                  {creatingUser ? "Saving..." : newAdminRole === "RIDER" ? "Create Delivery Rider" : "Save Admin User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-2xl max-w-2xl w-full p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto space-y-4 text-[#2D2327]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DBCE] sticky top-0 bg-white z-10">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#5B1E38]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1 text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#5B1E38] uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Belgian Truffle Cake"
                  className="w-full px-3 py-2 border border-[#E6DBCE] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5B1E38] uppercase mb-1">Category *</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E6DBCE] rounded-xl bg-white text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                  >
                    {PRIMARY_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {categorySlug === "cakes" && (
                  <div>
                    <label className="block font-bold text-[#5B1E38] uppercase mb-1">Sub-Category</label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E6DBCE] rounded-xl bg-white text-xs sm:text-sm focus:outline-none focus:border-[#802B52]"
                    >
                      {DEFAULT_CAKE_SUBCATEGORIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add New Sub-Category...</option>
                    </select>
                  </div>
                )}
              </div>

              {categorySlug === "cakes" && subCategory === "__NEW__" && (
                <div>
                  <label className="block font-bold text-[#802B52] uppercase mb-1">New Sub-Category Name *</label>
                  <input
                    type="text"
                    required
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    placeholder="e.g. Cheesecake Special"
                    className="w-full px-3 py-2 border border-[#E6DBCE] rounded-xl focus:outline-none focus:border-[#802B52]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#5B1E38] uppercase mb-1">
                  Cake Image (Optional)
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6DBCE] rounded-xl bg-[#FAF5EE] hover:bg-[#F3E8DB] text-xs font-bold text-[#802B52] transition-colors">
                      <span>{imagePreview ? "Change Image" : "Upload Cake Image"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
                      >
                        ✕ Remove Image
                      </button>
                    )}
                  </div>

                  {imageError && (
                    <p className="text-[11px] text-red-600 font-medium">
                      {imageError}
                    </p>
                  )}

                  {imagePreview && (
                    <div className="relative mt-2 p-3 bg-[#FAF5EE] border border-[#E6DBCE] rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#D5C3B3] bg-white shadow-sm shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Cake preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ WebP Format
                          </span>
                          {imageMeta && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3E8DB] text-[#5B1E38]">
                              {imageMeta.width} × {imageMeta.height} px
                            </span>
                          )}
                        </div>
                        {imageMeta ? (
                          <p className="text-xs text-gray-600">
                            Pixel Optimized: <span className="line-through text-gray-400">{imageMeta.originalSizeKb} KB</span> →{" "}
                            <span className="font-bold text-emerald-700">{imageMeta.webpSizeKb} KB</span>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Current image preview
                          </p>
                        )}
                        <p className="text-[11px] text-gray-500">
                          {selectedFile ? "Ready to sync with Cloudflare R2" : "Active product image"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5B1E38] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rich dark chocolate sponge layers with belgian cocoa ganache..."
                  className="w-full px-3 py-2 border border-[#E6DBCE] rounded-xl focus:outline-none focus:border-[#802B52]"
                />
              </div>

              {/* Eggless Option Availability Toggle (Only for Cake Categories) */}
              {isCakeCategory && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="eggless-available-checkbox"
                      checked={egglessAvailable}
                      onChange={(e) => setEgglessAvailable(e.target.checked)}
                      className="w-4 h-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                    />
                    <label htmlFor="eggless-available-checkbox" className="text-xs font-bold text-[#1C0D0A] cursor-pointer flex items-center gap-1.5">
                      <span>Eggless Option Available</span>
                      <span className="text-[10px] text-[#7A6B72] font-normal">
                        ({egglessAvailable ? "Customers can choose Eggless or With Egg" : "With Egg only — eggless dropdown hidden from customers"})
                      </span>
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${egglessAvailable ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"}`}>
                    {egglessAvailable ? "Eggless Available" : "Egg Only"}
                  </span>
                </div>
              )}

              {/* Variants Section */}
              <div className="border border-[#E6DBCE] rounded-xl p-3 bg-[#FAF5EE] space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#5B1E38] uppercase">Variants &amp; Prices</span>
                    {isCakeCategory && (
                      <span className="block text-[10px] text-[#7A6B72]">
                        Enter Size, Price, and optional Offer attribute (in black box)
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={handleAddVariantRow} className="text-xs font-bold text-[#802B52]">
                    + Add Variant
                  </button>
                </div>

                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className={`bg-white p-2.5 rounded-xl border border-[#E6DBCE] grid gap-2 items-center ${
                      isCakeCategory
                        ? "grid-cols-1 sm:grid-cols-12"
                        : "grid-cols-1 sm:grid-cols-3"
                    }`}
                  >
                    <div className={isCakeCategory ? "sm:col-span-3" : ""}>
                      <input
                        type="text"
                        value={v.name}
                        placeholder="Size (e.g. 1kg)"
                        onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded-lg text-xs"
                      />
                    </div>
                    <div className={isCakeCategory ? "sm:col-span-2" : ""}>
                      <input
                        type="number"
                        value={v.price}
                        placeholder="Price (₹)"
                        onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded-lg text-xs"
                      />
                    </div>
                    {isCakeCategory && (
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={v.offer || ""}
                          placeholder="Offer (e.g. 0.5kg cake, candle)"
                          onChange={(e) => handleVariantChange(idx, "offer", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#1C0D0A] text-white placeholder-gray-400 border border-[#1C0D0A] rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#802B52]"
                        />
                      </div>
                    )}
                    <div className={`flex items-center justify-between gap-1 ${isCakeCategory ? "sm:col-span-3" : ""}`}>
                      <select
                        value={v.isEggless ? "eggless" : "egg"}
                        onChange={(e) => handleVariantChange(idx, "isEggless", e.target.value === "eggless")}
                        className="flex-1 px-2 py-1.5 border border-[#E6DBCE] rounded-lg bg-white text-xs"
                      >
                        <option value="egg">Egg</option>
                        <option value="eggless">Eggless</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                        title="Remove Variant"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2 sticky bottom-0 bg-white py-2 border-t border-[#E6DBCE]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold border border-[#E6DBCE] text-[#7A6B72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold bg-[#802B52] hover:bg-[#962854] text-white shadow-md"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ORDER DETAILS & CUSTOMER REMARKS */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6DBCE] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E6DBCE] flex items-center justify-between bg-[#FAF5EE]/70 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-[#802B52] bg-white border border-[#E6DBCE] px-2.5 py-0.5 rounded-lg">
                    {selectedOrderModal.orderNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedOrderModal.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : selectedOrderModal.status === "CANCELLED"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : selectedOrderModal.status === "OUT_FOR_DELIVERY"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-purple-100 text-[#802B52] border border-purple-200"
                      }`}
                  >
                    {selectedOrderModal.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6B72]">
                  Ordered on {new Date(selectedOrderModal.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-[#E6DBCE] text-[#7A6B72] hover:text-[#1C0D0A] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#2D2327]">
              {/* Customer & Delivery Schedule Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF5EE]/50 border border-[#E6DBCE]/70 rounded-2xl p-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider block">Customer Details</span>
                  <p className="font-bold text-sm text-[#1C0D0A]">{selectedOrderModal.customerName}</p>
                  {selectedOrderModal.customerPhone && (
                    <p className="text-xs">
                      Phone:{" "}
                      <a href={`tel:${selectedOrderModal.customerPhone}`} className="text-[#802B52] font-semibold hover:underline">
                        {selectedOrderModal.customerPhone}
                      </a>
                    </p>
                  )}
                  {selectedOrderModal.customerEmail && (
                    <p className="text-xs text-[#7A6B72]">{selectedOrderModal.customerEmail}</p>
                  )}
                  <p className="text-[11px] text-[#5C524E] pt-1">
                    {selectedOrderModal.streetAddress}, {selectedOrderModal.city} - {selectedOrderModal.pincode}
                  </p>
                </div>

                <div className="space-y-1 sm:border-l sm:border-[#E6DBCE]/70 sm:pl-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6DBCE]/60">
                  <span className="text-[10px] uppercase font-bold text-[#7A6B72] tracking-wider block">Delivery Schedule &amp; Rider</span>
                  <p className="text-xs font-semibold text-[#5B1E38]">
                    Date: <span className="font-bold text-[#1C0D0A]">{selectedOrderModal.deliveryDate}</span>
                  </p>
                  <p className="text-xs font-semibold text-[#802B52]">
                    Slot: <span className="font-bold">{selectedOrderModal.deliveryTimeSlot}</span>
                  </p>
                  {selectedOrderModal.deliveryPartnerName && (
                    <p className="text-xs text-[#5C524E]">
                      Rider: <span className="font-semibold text-[#1C0D0A]">{selectedOrderModal.deliveryPartnerName}</span>
                      {selectedOrderModal.deliveryPartnerPhone && ` (${selectedOrderModal.deliveryPartnerPhone})`}
                    </p>
                  )}
                  {selectedOrderModal.deliveryOtp && (
                    <div className="pt-1 flex items-center gap-1.5">
                      <span className="text-[11px] text-[#7A6B72] font-semibold">Delivery OTP:</span>
                      <span className="font-mono font-bold text-xs text-[#802B52] bg-white border border-[#E6DBCE] px-2 py-0.5 rounded shadow-2xs">
                        {selectedOrderModal.deliveryOtp} {selectedOrderModal.deliveryOtpVerified && "✓"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Ordered Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#5B1E38]">
                    Products Ordered ({selectedOrderModal.items?.length || 0})
                  </h4>
                  <span className="text-[11px] font-semibold text-[#7A6B72]">
                    Total Cakes: {selectedOrderModal.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || selectedOrderModal.items?.length || 0}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedOrderModal.items?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF5EE]/40 border border-[#E6DBCE] rounded-xl p-3 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-extrabold text-xs sm:text-sm text-[#1C0D0A]">
                            <span className="text-[#802B52] font-black mr-1">{item.quantity}x</span>
                            {item.productName}
                            {item.variantName ? ` (${item.variantName})` : ""}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xs sm:text-sm text-[#802B52]">
                            ₹{item.lineTotal || (item.unitPrice * item.quantity)}
                          </span>
                          <span className="text-[10px] text-[#7A6B72] block">
                            (₹{item.unitPrice} each)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold ${item.isEggless
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-900 border border-amber-200"
                            }`}
                        >
                          {item.isEggless ? "Eggless" : "With Egg"}
                        </span>

                        {!item.isEggless && item.offer && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-bold">
                            Offer: {item.offer}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single Cake Inscription / Remarks for the entire order */}
              <div className="bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#5B1E38] flex items-center gap-1.5">
                    <span>Cake Inscription / Remarks:</span>
                  </span>
                  <span className="text-[10px] text-[#7A6B72] font-semibold">Message on Cake</span>
                </div>

                {(() => {
                  const inscription =
                    selectedOrderModal.cakeMessage ||
                    selectedOrderModal.items?.find((it: any) => it.cakeMessage)?.cakeMessage;
                  return inscription ? (
                    <div className="bg-white p-3 rounded-lg border border-[#E6DBCE] text-xs font-semibold italic text-[#802B52] shadow-2xs">
                      &ldquo;{inscription}&rdquo;
                    </div>
                  ) : (
                    <div className="bg-white/60 p-2.5 rounded-lg border border-[#E6DBCE]/50 text-xs text-[#7A6B72] italic">
                      No cake inscription requested for this order.
                    </div>
                  );
                })()}
              </div>

              {/* Customer Texted Remarks & Special Instructions / Delivery Notes */}
              <div className="bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#5B1E38] flex items-center gap-1.5">
                    <span>Customer Remarks &amp; Special Instructions</span>
                  </span>
                  <span className="text-[10px] text-[#802B52] font-bold bg-[#FAF0F2] px-2 py-0.5 rounded-full border border-[#802B52]/20">
                    Delivery Notes / Bakery Requests
                  </span>
                </div>

                {(() => {
                  const notes =
                    selectedOrderModal.specialInstructions ||
                    selectedOrderModal.deliveryNotes;
                  return notes ? (
                    <div className="bg-white p-3 rounded-lg border border-[#E6DBCE] text-xs text-[#1C0D0A] font-medium whitespace-pre-wrap leading-relaxed shadow-2xs">
                      {notes}
                    </div>
                  ) : (
                    <div className="bg-white/60 p-2.5 rounded-lg border border-[#E6DBCE]/50 text-xs text-[#7A6B72] italic">
                      No special instructions or delivery notes were texted by the customer for this order.
                    </div>
                  );
                })()}
              </div>

              {/* Payment & Amount Summary */}
              <div className="bg-[#FAF5EE]/40 border border-[#E6DBCE] rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between text-xs text-[#7A6B72]">
                  <span>Payment Method:</span>
                  <span className="font-bold text-[#1C0D0A] uppercase">{selectedOrderModal.paymentMethod || "COD"}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7A6B72]">
                  <span>Payment Status:</span>
                  <span className={`font-bold ${selectedOrderModal.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-800"}`}>
                    {selectedOrderModal.paymentStatus || "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#7A6B72]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1C0D0A]">₹{selectedOrderModal.subtotal}</span>
                </div>
                {Number(selectedOrderModal.deliveryFee || 0) > 0 && (
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-[#1C0D0A]">₹{selectedOrderModal.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#802B52] pt-2 border-t border-[#E6DBCE]">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrderModal.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3.5 sm:p-4 border-t border-[#E6DBCE] bg-[#FAF5EE]/70 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="px-5 py-2 rounded-xl bg-[#802B52] hover:bg-[#962854] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
