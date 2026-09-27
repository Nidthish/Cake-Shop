"use client";

import { useEffect, useState, useMemo } from "react";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
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
  badge?: string;
  rating: number;
  reviewCount: number;
  productType: string;
  isActive: boolean;
  isOfferProduct?: boolean;
  isEggless?: boolean;
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
  createdAt: string;
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
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Sales Filter State
  const [salesDateFilter, setSalesDateFilter] = useState<"today" | "yesterday" | "7days" | "month" | "all">("today");

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
  const [badge, setBadge] = useState<string>("");
  const [variants, setVariants] = useState<VariantInput[]>([
    { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
    { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: false },
  ]);

  // Create Admin User Modal State
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>("");
  const [newAdminEmail, setNewAdminEmail] = useState<string>("");
  const [newAdminPassword, setNewAdminPassword] = useState<string>("");
  const [newAdminRole, setNewAdminRole] = useState<"ADMIN" | "SUPERADMIN">("ADMIN");
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  // Check auth session on mount
  useEffect(() => {
    setIsMounted(true);
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
        loadDashboardData();
      } else {
        setLoginError(data.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setLoginError("Login server error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) {}
    setIsAuthenticated(false);
    setAdminUser(null);
  }

  async function loadDashboardData() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders(), fetchAdminUsers()]);
    setLoading(false);
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        if (data.products) setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
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

  // Create Admin User Handler
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
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlertMessage(`✅ Admin user "${newAdminName}" created successfully!`);
        setShowUserModal(false);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        fetchAdminUsers();
      } else {
        alert(data.error || "Failed to create admin user.");
      }
    } catch (err: any) {
      alert("Error creating admin user: " + err.message);
    } finally {
      setCreatingUser(false);
    }
  }

  // Sales Analytics Computation with Date Filter
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const orderDateStr = orderDate.toISOString().split("T")[0];

      if (salesDateFilter === "today") {
        return orderDateStr === todayStr;
      } else if (salesDateFilter === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return orderDateStr === yesterday.toISOString().split("T")[0];
      } else if (salesDateFilter === "7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      } else if (salesDateFilter === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // "all"
    });
  }, [orders, salesDateFilter]);

  const salesStats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCount = filteredOrders.length;
    const avgOrderValue = totalCount > 0 ? totalRevenue / totalCount : 0;
    const paidOrders = filteredOrders.filter((o) => o.paymentStatus === "PAID").length;
    const pendingOrders = filteredOrders.filter((o) => o.status === "PENDING" || o.paymentStatus === "PENDING").length;

    return { totalRevenue, totalCount, avgOrderValue, paidOrders, pendingOrders };
  }, [filteredOrders]);

  // Product Helpers
  function handleAddVariantRow() {
    setVariants([
      ...variants,
      { name: "1.5kg", price: 1250, weightValue: 1.5, weightUnit: "kg", isEggless: true, serves: "12-14 Servings", isOffer1kgFree: false },
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
    setBadge("");
    setVariants([
      { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
      { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: false },
    ]);
    setShowAddModal(true);
  }

  function handleEditClick(p: ProductAdmin) {
    setEditingProduct(p);
    setName(p.name);
    setCategorySlug(p.category);
    setSubCategory(p.subCategory || "Normal Flavors");
    setDescription(p.description || "");
    setImageName(p.imageName || "signature.cake.1");
    setBadge(p.badge || "");
    setVariants(
      p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        weightValue: v.weightValue,
        weightUnit: v.weightUnit,
        isEggless: v.isEggless,
        serves: v.serves,
        isOffer1kgFree: v.isOffer1kgFree,
      }))
    );
    setShowAddModal(true);
  }

  async function handleToggleSales(id: string, currentActive: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage(`Product sales status updated to ${!currentActive ? "Active" : "Paused"}`);
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to toggle product status.");
    }
  }

  async function handleDeleteProduct(id: string, nameStr: string) {
    if (!confirm(`Are you sure you want to delete "${nameStr}" from MySQL database?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAlertMessage(`Deleted "${nameStr}" successfully.`);
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to delete product.");
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        categorySlug,
        subCategory: categorySlug === "cakes" && subCategory === "__NEW__" ? customSubCategory : subCategory,
        description,
        imageName,
        badge,
        productType: categorySlug === "snacks" ? "SNACK" : "CAKE",
        isActive: true,
        variants,
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAlertMessage(data.message || "Product saved successfully!");
        setShowAddModal(false);
        fetchProducts();
      } else {
        alert(data.error || "Failed to save product.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage("Order status updated successfully!");
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to update order status.");
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchTerm.toLowerCase());

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
          <p className="font-serif text-sm text-[#E6C184] tracking-widest uppercase">Verifying Admin JWT Security Session...</p>
        </div>
      </div>
    );
  }

  // 🔒 HIGH-SECURITY LOGIN PORTAL (UNAUTHENTICATED VIEW)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C061E] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#2A082C] rounded-3xl border border-[#962854]/40 p-8 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#802B52]/40 border border-[#E6C184]/40 flex items-center justify-center mx-auto text-3xl shadow-lg">
              🔐
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Lollipop Admin Security Portal
            </h1>
            <p className="text-xs text-[#D8C3B3]">
              Ethical Hacker JWT Standard Secured Control Panel
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3.5 text-xs text-red-200 text-center font-medium">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-[#E6C184] mb-2 tracking-wider">
                Admin Email Address
              </label>

              <input
                type="email"
                required
                placeholder="admin@lollipopcakeshop.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1C061E] border border-[#962854]/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6C184] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#E6C184] mb-2 tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1C061E] border border-[#962854]/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6C184] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#802B52] hover:bg-[#962854] text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-pink-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In To Admin Console ➔"
              )}
            </button>
          </form>

          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-[11px] text-gray-400">
              Default Seed Email: <code className="text-[#E6C184]">admin@lollipopcakeshop.com</code> | Password: <code className="text-[#E6C184]">Admin@123456</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🏆 AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2D2327]">
      {/* Sleek Admin Navbar Header (Client Header Removed!) */}
      <header className="bg-[#2A082C] border-b border-[#962854]/40 text-white px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#802B52] flex items-center justify-center text-xl shadow-md border border-[#E6C184]/30">
              🎂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide">
                  Lollipop Administration
                </h1>
                <span className="bg-[#E6C184]/20 border border-[#E6C184]/40 text-[#E6C184] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {adminUser?.role || "ADMIN"}
                </span>
              </div>
              <p className="text-xs text-[#D8C3B3]">
                Logged in as <strong className="text-white">{adminUser?.fullName}</strong> ({adminUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#E6C184] hover:bg-[#d8b070] text-[#2A082C] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ Add New Cake / Product
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
            >
              🌐 View Storefront
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/40 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {alertMessage && (
          <div className="bg-[#802B52] text-white px-5 py-3 rounded-xl flex justify-between items-center text-sm shadow-md">
            <span>{alertMessage}</span>
            <button onClick={() => setAlertMessage(null)} className="font-bold text-xs hover:opacity-80">
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* Admin Dashboard Tabs */}
        <div className="flex border-b border-[#E6DBCE] space-x-2 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "sales"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            📊 Sales &amp; Analytics
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "products"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            🎂 Products &amp; Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            📦 Live Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "users"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            👥 Manage Admin Users ({adminUsersList.length})
          </button>
        </div>

        {/* TAB 1: SALES & ANALYTICS DASHBOARD */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#5B1E38]">
                  Sales Performance &amp; Revenue Analytics
                </h2>
                <p className="text-xs text-[#7A6B72]">
                  Real-time transaction statistics from live order history.
                </p>
              </div>

              {/* Date Filter Bar */}
              <div className="flex items-center gap-1.5 bg-[#FAF5EE] p-1.5 rounded-xl border border-[#E6DBCE]">
                {(["today", "yesterday", "7days", "month", "all"] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setSalesDateFilter(filterKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      salesDateFilter === filterKey
                        ? "bg-[#802B52] text-white shadow-sm"
                        : "text-[#7A6B72] hover:bg-[#E6DBCE]/50"
                    }`}
                  >
                    {filterKey === "today"
                      ? "Today"
                      : filterKey === "yesterday"
                      ? "Yesterday"
                      : filterKey === "7days"
                      ? "Last 7 Days"
                      : filterKey === "month"
                      ? "This Month"
                      : "All Time"}
                  </button>
                ))}
              </div>
            </div>

            {/* Sales Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Total Sales Revenue
                </span>
                <div className="text-3xl font-extrabold text-[#802B52]">
                  ₹{salesStats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">
                  💳 Total gross receipts in filter window
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Total Orders Count
                </span>
                <div className="text-3xl font-extrabold text-[#2A082C]">
                  {salesStats.totalCount} Orders
                </div>
                <p className="text-[11px] text-[#7A6B72] font-medium">
                  📦 Completed &amp; processing purchases
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Average Order Value (AOV)
                </span>
                <div className="text-3xl font-extrabold text-[#962854]">
                  ₹{salesStats.avgOrderValue.toFixed(2)}
                </div>
                <p className="text-[11px] text-[#7A6B72] font-medium">
                  🎂 Mean customer cart spend
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Payment Verified (PAID)
                </span>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {salesStats.paidOrders} / {salesStats.totalCount}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✅ Verified via Razorpay signature
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products by name, code or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6DBCE] text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6DBCE] text-sm bg-white font-medium focus:outline-none focus:border-[#802B52]"
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
                  className="px-4 py-2.5 rounded-xl border border-[#E6DBCE] bg-[#FAF5EE] hover:bg-[#f2e7d8] text-xs font-bold text-[#802B52] transition-all cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-[#7A6B72]">
                No products found matching your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Product Details</th>
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
                          <div className="font-bold text-sm text-[#2D2327]">{p.name}</div>
                          <div className="text-[11px] text-[#7A6B72]">{p.slug}</div>
                        </td>
                        <td className="py-4 px-4 font-medium text-[#5B1E38]">{p.categoryName}</td>
                        <td className="py-4 px-4">
                          {p.variants.map((v, i) => (
                            <span key={i} className="inline-block bg-[#FAF5EE] border border-[#E6DBCE] text-[#2D2327] font-semibold px-2 py-0.5 rounded text-[11px] mr-1.5 mb-1">
                              {v.name}: ₹{v.price}
                            </span>
                          ))}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {p.isActive ? "🟢 Active for Sales" : "🔴 Sales Paused"}
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
                            <button
                              onClick={() => handleEditClick(p)}
                              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-[#802B52] text-white hover:bg-[#682242] cursor-pointer"
                            >
                              Edit Item
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE CUSTOMER ORDERS (REMOVED DUMMY ORDER!) */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-[#5B1E38]">
                Recent Orders in Database
              </h2>
              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#F3E8DB] cursor-pointer"
              >
                🔄 Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-[#7A6B72] font-serif">
                No customer orders recorded in the database yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Delivery Schedule</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DBCE]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-4 px-4 font-mono font-bold text-[#802B52]">{o.orderNumber}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#2D2327]">{o.customerName}</div>
                          <div className="text-[11px] text-[#7A6B72]">{o.customerPhone}</div>
                          <div className="text-[11px] text-[#7A6B72]">{o.customerEmail}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-[#5B1E38]">{o.deliveryDate}</div>
                          <div className="text-[11px] text-[#7A6B72]">{o.deliveryTimeSlot}</div>
                        </td>
                        <td className="py-4 px-4">
                          {o.items?.map((i: any, idx: number) => (
                            <div key={idx} className="text-[11px]">
                              {i.quantity}x {i.productName} ({i.variantName})
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#802B52]">₹{o.totalAmount}</td>
                        <td className="py-4 px-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MANAGE ADMIN USERS */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5B1E38]">
                  Authorized Admin User Accounts
                </h2>
                <p className="text-xs text-[#7A6B72]">
                  Existing admins can grant administrator permissions to new staff members.
                </p>
              </div>

              <button
                onClick={() => setShowUserModal(true)}
                className="bg-[#802B52] hover:bg-[#962854] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                ➕ Create New Admin User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DBCE]">
                  {adminUsersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-4 px-4 font-bold text-[#2D2327]">{u.fullName}</td>
                      <td className="py-4 px-4 font-mono text-[#802B52]">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${u.role === "SUPERADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {u.role}
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

      {/* CREATE NEW ADMIN USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-2xl max-w-md w-full p-6 space-y-5 text-[#2D2327]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DBCE]">
              <h3 className="font-serif text-xl font-bold text-[#5B1E38]">
                Add New Admin Account
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E6DBCE] text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@lollipopcakeshop.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E6DBCE] text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E6DBCE] text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1">
                  Assigned Privilege Role *
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E6DBCE] text-sm bg-white focus:outline-none focus:border-[#802B52]"
                >
                  <option value="ADMIN">ADMIN (Catalog &amp; Orders Management)</option>
                  <option value="SUPERADMIN">SUPERADMIN (Full Privileges)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-[#E6DBCE] text-[#7A6B72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#802B52] hover:bg-[#962854] text-white"
                >
                  {creatingUser ? "Creating..." : "Save Admin User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-2xl max-w-2xl w-full p-6 my-8 space-y-4 text-[#2D2327]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DBCE]">
              <h3 className="font-serif text-xl font-bold text-[#5B1E38]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
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
                  className="w-full px-3 py-2 border border-[#E6DBCE] rounded-lg text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5B1E38] uppercase mb-1">Category *</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E6DBCE] rounded-lg bg-white focus:outline-none focus:border-[#802B52]"
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
                      className="w-full px-3 py-2 border border-[#E6DBCE] rounded-lg bg-white focus:outline-none focus:border-[#802B52]"
                    >
                      {DEFAULT_CAKE_SUBCATEGORIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="__NEW__">➕ Add New Sub-Category...</option>
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
                    className="w-full px-3 py-2 border border-[#E6DBCE] rounded-lg focus:outline-none focus:border-[#802B52]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#5B1E38] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rich dark chocolate sponge layers with belgian cocoa ganache..."
                  className="w-full px-3 py-2 border border-[#E6DBCE] rounded-lg focus:outline-none focus:border-[#802B52]"
                />
              </div>

              {/* Variants Section */}
              <div className="border border-[#E6DBCE] rounded-xl p-3 bg-[#FAF5EE] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#5B1E38] uppercase">Variants &amp; Prices</span>
                  <button type="button" onClick={handleAddVariantRow} className="text-xs font-bold text-[#802B52]">
                    + Add Variant
                  </button>
                </div>

                {variants.map((v, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#E6DBCE] grid grid-cols-3 gap-2 items-center">
                    <input
                      type="text"
                      value={v.name}
                      placeholder="Size (e.g. 1kg)"
                      onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                      className="px-2 py-1 border border-[#E6DBCE] rounded"
                    />
                    <input
                      type="number"
                      value={v.price}
                      placeholder="Price (₹)"
                      onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 border border-[#E6DBCE] rounded"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={v.isEggless ? "eggless" : "egg"}
                        onChange={(e) => handleVariantChange(idx, "isEggless", e.target.value === "eggless")}
                        className="px-2 py-1 border border-[#E6DBCE] rounded bg-white"
                      >
                        <option value="eggless">🌱 Eggless</option>
                        <option value="egg">🥚 Contains Egg</option>
                      </select>
                      <button type="button" onClick={() => handleRemoveVariantRow(idx)} className="text-red-500 font-bold px-1">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg font-bold border border-[#E6DBCE] text-[#7A6B72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg font-bold bg-[#802B52] hover:bg-[#962854] text-white"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
