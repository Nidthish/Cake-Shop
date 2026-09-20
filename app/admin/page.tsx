"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

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
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>("");
  const [categorySlug, setCategorySlug] = useState<string>("cakes");
  const [subCategory, setSubCategory] = useState<string>("Normal Flavors");
  const [customSubCategory, setCustomSubCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageName, setImageName] = useState<string>("product.image");
  const [badge, setBadge] = useState<string>("");
  const [productType, setProductType] = useState<string>("CAKE");
  const [isActive, setIsActive] = useState<boolean>(true);

  // Variant Inputs
  const [variants, setVariants] = useState<VariantInput[]>([
    {
      name: "0.5kg",
      price: 370,
      weightValue: 0.5,
      weightUnit: "kg",
      isEggless: true,
      serves: "4-6 Servings",
      isOffer1kgFree: false,
    },
    {
      name: "1kg",
      price: 699,
      weightValue: 1.0,
      weightUnit: "kg",
      isEggless: true,
      serves: "8-10 Servings",
      isOffer1kgFree: true,
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
    fetchOrders();
  }, []);

  // Compute all available sub-categories for cakes (defaults + existing in DB)
  const availableCakeSubCategories = useMemo(() => {
    const list = [...DEFAULT_CAKE_SUBCATEGORIES];
    products.forEach((p) => {
      const sub = p.subCategory || p.categoryName;
      if (
        sub &&
        sub !== "General" &&
        sub !== "cakes" &&
        !list.includes(sub)
      ) {
        list.push(sub);
      }
    });
    return list;
  }, [products]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch admin products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    }
  }

  function handleOpenAddModal() {
    setEditingProduct(null);
    setName("");
    setCategorySlug("cakes");
    setSubCategory("Normal Flavors");
    setCustomSubCategory("");
    setDescription("");
    setImageName("product.image");
    setBadge("");
    setProductType("CAKE");
    setIsActive(true);
    setVariants([
      { name: "0.5kg", price: 370, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
      { name: "1kg", price: 699, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: true },
    ]);
    setShowAddModal(true);
  }

  function handleEditClick(p: ProductAdmin) {
    setEditingProduct(p);
    setName(p.name);
    setCategorySlug(p.category || "cakes");

    const currentSub = p.subCategory || p.categoryName || "Normal Flavors";
    setSubCategory(currentSub);
    setCustomSubCategory("");

    setDescription(p.description || "");
    setImageName(p.imageName || "product.image");
    setBadge(p.badge || "");
    setProductType(p.productType || "CAKE");
    setIsActive(p.isActive);

    setVariants(
      p.variants.length > 0
        ? p.variants.map((v) => ({
            ...v,
            isEggless: v.isEggless !== undefined ? v.isEggless : true,
            isOffer1kgFree: !!(v.isOffer1kgFree || (p.isOfferProduct && v.name.includes("1kg"))),
          }))
        : [
            { name: "0.5kg", price: 370, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
            { name: "1kg", price: 699, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: true },
          ]
    );
    setShowAddModal(true);
  }

  async function handleToggleSales(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage(`Sales ${!currentStatus ? "Resumed" : "Paused"} for item!`);
        setTimeout(() => setAlertMessage(null), 3000);
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to toggle sales:", err);
    }
  }

  async function handleDeleteProduct(id: string, productName: string) {
    if (!confirm(`Are you sure you want to delete "${productName}" from MySQL database?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAlertMessage(`Product "${productName}" deleted successfully!`);
        setTimeout(() => setAlertMessage(null), 3000);
        fetchProducts();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("Product name is required!");
    if (variants.length === 0) return alert("At least one variant price is required!");

    let finalSubCategory = subCategory;
    if (categorySlug === "cakes") {
      if (subCategory === "__NEW__") {
        if (!customSubCategory.trim()) {
          return alert("Please enter a name for the new sub-category!");
        }
        finalSubCategory = customSubCategory.trim();
      }
    } else {
      finalSubCategory = "";
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        categorySlug,
        subCategory: finalSubCategory,
        description: description.trim(),
        imageName: imageName.trim() || "product.image",
        badge: badge.trim(),
        productType,
        isActive,
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
      if (data.success) {
        setAlertMessage(data.message || "Product saved successfully!");
        setTimeout(() => setAlertMessage(null), 3000);
        setShowAddModal(false);
        fetchProducts();
      } else {
        alert(data.error || "Save failed");
      }
    } catch (err) {
      console.error("Save product error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, status: string) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage("Order status updated in MySQL!");
        setTimeout(() => setAlertMessage(null), 3000);
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }

  // Variant Helpers
  function handleAddVariantRow() {
    setVariants([
      ...variants,
      { name: "1.5kg", price: 999, weightValue: 1.5, weightUnit: "kg", isEggless: true, serves: "12-15 Servings", isOffer1kgFree: false },
    ]);
  }

  function handleRemoveVariantRow(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  function handleVariantChange(index: number, field: keyof VariantInput, value: any) {
    const next = [...variants];
    next[index] = { ...next[index], [field]: value };
    setVariants(next);
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#2D2327] flex items-center justify-center p-8">
        <div className="text-center font-serif text-xl text-[#802B52]">
          Loading Lollipop Admin Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#FDFBF7] text-[#2D2327]">
      {/* Top Banner Header */}
      <header suppressHydrationWarning className="bg-gradient-to-r from-[#5B1E38] via-[#802B52] to-[#A03567] text-white shadow-lg border-b border-[#D4AF37]/30">
        <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-[#D4AF37] text-[#5B1E38] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Production MySQL Admin
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Lollipop Cake Shop Administration
              </h1>
            </div>
            <p className="text-[#F9F1E6]/80 text-sm mt-1">
              Live Database Control Panel — Manage Catalog, Categories, Prices, Sub-Categories & Orders in MySQL
            </p>
          </div>

          <div suppressHydrationWarning className="flex items-center gap-3">
            <Link
              href="/cakes"
              target="_blank"
              suppressHydrationWarning
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white flex items-center gap-1.5"
            >
              <span>🌐 View Live Client Store</span>
            </Link>
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#D4AF37] text-[#5B1E38] hover:bg-[#E5C158] shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              + Add New Cake / Product
            </button>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {alertMessage && (
        <div suppressHydrationWarning className="bg-[#2D5B43] text-white px-4 py-3 text-center text-sm font-semibold shadow-md flex justify-center items-center gap-2">
          <span>✅</span> {alertMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div suppressHydrationWarning className="flex border-b border-[#E6DBCE] mb-8 gap-4">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-serif text-lg font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "products"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            🎂 Products & Catalog ({products.length})
          </button>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-serif text-lg font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "orders"
                ? "border-[#802B52] text-[#802B52]"
                : "border-transparent text-[#7A6B72] hover:text-[#2D2327]"
            }`}
          >
            📦 Live Customer Orders ({orders.length})
          </button>
        </div>

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div suppressHydrationWarning>
            {/* Filter & Search Bar */}
            <div suppressHydrationWarning className="bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div suppressHydrationWarning className="flex-1 w-full md:w-auto relative">
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="Search products by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-[#FDFBF7] text-sm text-[#2D2327] focus:outline-none focus:border-[#802B52]"
                />
              </div>

              <div suppressHydrationWarning className="flex items-center gap-3 w-full md:w-auto">
                <label suppressHydrationWarning className="text-xs font-semibold text-[#7A6B72] whitespace-nowrap">
                  Category:
                </label>
                <select
                  suppressHydrationWarning
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#E6DBCE] bg-white text-xs font-semibold text-[#2D2327] focus:outline-none focus:border-[#802B52]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {PRIMARY_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={fetchProducts}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#F3E8DB] transition-all"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Products Table */}
            {loading ? (
              <div suppressHydrationWarning className="text-center py-12 text-[#7A6B72] font-serif text-lg">
                Loading products from MySQL database...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div suppressHydrationWarning className="text-center py-12 bg-white rounded-xl border border-[#E6DBCE] p-8">
                <p className="text-[#7A6B72] font-serif text-lg">No products found matching your filter.</p>
              </div>
            ) : (
              <div suppressHydrationWarning className="bg-white rounded-xl border border-[#E6DBCE] shadow-sm overflow-hidden">
                <div suppressHydrationWarning className="overflow-x-auto">
                  <table suppressHydrationWarning className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Item Details</th>
                        <th className="py-3.5 px-4">Category / Sub-Category</th>
                        <th className="py-3.5 px-4">Price & Variants</th>
                        <th className="py-3.5 px-4">Offer & Egg Status</th>
                        <th className="py-3.5 px-4">Sales Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DBCE]">
                      {filteredProducts.map((p) => {
                        const minPrice =
                          p.variants && p.variants.length > 0
                            ? Math.min(...p.variants.map((v) => v.price))
                            : 0;

                        return (
                          <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E6DBCE] flex items-center justify-center font-bold text-[#802B52]">
                                  🎂
                                </div>
                                <div>
                                  <h3 className="font-serif font-bold text-sm text-[#2D2327]">
                                    {p.name}
                                  </h3>
                                  <p className="text-[11px] text-[#7A6B72]">Slug: {p.slug}</p>
                                  {p.badge && (
                                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#802B52]/10 text-[#802B52]">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4 font-semibold text-[#5B1E38]">
                              <div>
                                {PRIMARY_CATEGORIES.find((c) => c.slug === p.category)?.name || p.category}
                              </div>
                              {p.category === "cakes" && (
                                <span className="text-[10px] text-[#802B52] font-bold block mt-0.5">
                                  Sub: {p.subCategory || "Normal Flavors"}
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-[#802B52] text-sm">
                                From ₹{minPrice}
                              </div>
                              <div className="text-[11px] text-[#7A6B72] mt-0.5">
                                {p.variants && p.variants.length > 0
                                  ? p.variants.map((v) => `${v.name}: ₹${v.price}`).join(" | ")
                                  : "Standard Pricing"}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1">
                                {p.isOfferProduct ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#802B52] text-white w-max">
                                    🎁 1kg + 1/2kg Free
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-[#7A6B72]">Standard Offer</span>
                                )}

                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold w-max ${
                                    p.isEggless !== false
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {p.isEggless !== false ? "🌱 100% Eggless" : "🥚 Contains Egg"}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  p.isActive
                                    ? "bg-[#2D5B43]/10 text-[#2D5B43]"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {p.isActive ? "🟢 Active for Sales" : "🔴 Sales Paused"}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  suppressHydrationWarning
                                  onClick={() => handleToggleSales(p.id, p.isActive)}
                                  className={`px-3 py-1.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                                    p.isActive
                                      ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100"
                                      : "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                                  }`}
                                >
                                  {p.isActive ? "Pause Sales" : "Resume Sales"}
                                </button>
                                <button
                                  type="button"
                                  suppressHydrationWarning
                                  onClick={() => handleEditClick(p)}
                                  className="px-3 py-1.5 rounded text-[11px] font-semibold bg-[#802B52] text-white hover:bg-[#682242] transition-all cursor-pointer"
                                >
                                  Edit Item
                                </button>
                                <button
                                  type="button"
                                  suppressHydrationWarning
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="px-2.5 py-1.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === "orders" && (
          <div suppressHydrationWarning className="bg-white rounded-xl border border-[#E6DBCE] shadow-sm overflow-hidden p-6">
            <div suppressHydrationWarning className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-[#5B1E38]">
                Recent Orders in MySQL Database
              </h2>
              <button
                type="button"
                suppressHydrationWarning
                onClick={fetchOrders}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-[#FAF5EE] text-[#802B52] border border-[#E6DBCE] hover:bg-[#F3E8DB] transition-all cursor-pointer"
              >
                🔄 Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <p suppressHydrationWarning className="text-center py-8 text-[#7A6B72] font-serif">
                No customer orders recorded in the database yet.
              </p>
            ) : (
              <div suppressHydrationWarning className="overflow-x-auto">
                <table suppressHydrationWarning className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#E6DBCE] text-[#5B1E38] font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Delivery Schedule</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Eggless Notice</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DBCE]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-4 px-4 font-mono font-bold text-[#802B52]">
                          {o.orderNumber}
                        </td>
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
                          {o.items && o.items.map((i, idx) => (
                            <div key={idx} className="text-[11px]">
                              {i.quantity}x {i.productName} ({i.variantName})
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#802B52]">
                          ₹{o.totalAmount}
                        </td>
                        <td className="py-4 px-4">
                          {o.hasEgglessItems ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              ⚠️ Eggless (1-Day Notice Enforced)
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#7A6B72]">Regular</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            suppressHydrationWarning
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
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div suppressHydrationWarning className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div suppressHydrationWarning className="bg-white rounded-2xl border border-[#E6DBCE] shadow-2xl max-w-3xl w-full p-6 sm:p-8 my-8 text-[#2D2327]">
            <div suppressHydrationWarning className="flex justify-between items-center pb-4 border-b border-[#E6DBCE]">
              <h2 className="font-serif text-2xl font-bold text-[#5B1E38]">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Cake / Product"}
              </h2>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  placeholder="e.g. Belgian Chocolate Truffle Cake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#802B52]"
                />
              </div>

              {/* Dynamic Categories & Sub-Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1.5">
                    Primary Category *
                  </label>
                  <select
                    suppressHydrationWarning
                    value={categorySlug}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategorySlug(newCat);
                      if (newCat === "cakes" && !subCategory) {
                        setSubCategory("Normal Flavors");
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-white text-sm font-medium focus:outline-none focus:border-[#802B52]"
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
                    <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1.5">
                      Sub-Category *
                    </label>
                    <select
                      suppressHydrationWarning
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-white text-sm font-medium focus:outline-none focus:border-[#802B52]"
                    >
                      {availableCakeSubCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="__NEW__">➕ Add New Sub-Category...</option>
                    </select>
                  </div>
                )}
              </div>

              {/* New Custom Sub-Category Input (If Selected) */}
              {categorySlug === "cakes" && subCategory === "__NEW__" && (
                <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#E6DBCE]">
                  <label className="block text-xs font-bold uppercase text-[#802B52] mb-1.5">
                    New Sub-Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    placeholder="e.g. Royal Cheesecake"
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-white text-sm focus:outline-none focus:border-[#802B52]"
                  />
                  <p className="text-[11px] text-[#7A6B72] mt-1">
                    This sub-category will be created and displayed across admin filters and client store filters!
                  </p>
                </div>
              )}

              {/* Description & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="Rich Belgian chocolate sponge layered with cocoa ganache..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#802B52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B1E38] mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="e.g. BEST SELLER"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6DBCE] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#802B52]"
                  />
                </div>
              </div>

              {/* Price Variants & Per-Variant Offer & Egg Preference Section */}
              <div suppressHydrationWarning className="border border-[#E6DBCE] rounded-xl p-4 bg-[#FAF5EE]">
                <div suppressHydrationWarning className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#5B1E38]">
                      Weight & Price Variations (With Variant Offer & Egg Preference)
                    </h3>
                    <p className="text-[11px] text-[#7A6B72]">
                      Set price, egg preference, and special offers per variant size.
                    </p>
                  </div>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={handleAddVariantRow}
                    className="text-xs font-bold text-[#802B52] hover:underline cursor-pointer"
                  >
                    + Add Variant Row
                  </button>
                </div>

                <div suppressHydrationWarning className="space-y-3">
                  {variants.map((v, index) => (
                    <div
                      key={index}
                      suppressHydrationWarning
                      className="bg-white p-3.5 rounded-lg border border-[#E6DBCE] grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-[#7A6B72]">Weight / Size</label>
                        <input
                          type="text"
                          suppressHydrationWarning
                          value={v.name}
                          onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded text-xs focus:outline-none focus:border-[#802B52]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#7A6B72]">Price (₹)</label>
                        <input
                          type="number"
                          suppressHydrationWarning
                          value={v.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded text-xs focus:outline-none focus:border-[#802B52]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#7A6B72]">Egg Preference</label>
                        <select
                          suppressHydrationWarning
                          value={v.isEggless !== false ? "eggless" : "egg"}
                          onChange={(e) =>
                            handleVariantChange(index, "isEggless", e.target.value === "eggless")
                          }
                          className="w-full px-2 py-1.5 border border-[#E6DBCE] rounded text-xs bg-white focus:outline-none focus:border-[#802B52]"
                        >
                          <option value="eggless">🌱 100% Eggless</option>
                          <option value="egg">🥚 Contains Egg</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-[#7A6B72]">Variant Offer</label>
                          <select
                            suppressHydrationWarning
                            value={v.isOffer1kgFree ? "offer" : "standard"}
                            onChange={(e) =>
                              handleVariantChange(index, "isOffer1kgFree", e.target.value === "offer")
                            }
                            className="w-full px-2 py-1.5 border border-[#E6DBCE] rounded text-xs bg-white focus:outline-none focus:border-[#802B52]"
                          >
                            <option value="standard">Standard</option>
                            <option value="offer">🎁 1kg Free Offer</option>
                          </select>
                        </div>

                        {variants.length > 1 && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => handleRemoveVariantRow(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer pt-3 ml-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div suppressHydrationWarning className="flex justify-end gap-3 pt-4 border-t border-[#E6DBCE]">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  suppressHydrationWarning
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold rounded-lg bg-[#802B52] text-white hover:bg-[#682242] shadow-md transition-all uppercase tracking-wider cursor-pointer"
                >
                  {saving ? "Saving to MySQL..." : editingProduct ? "Update Product" : "Publish New Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
