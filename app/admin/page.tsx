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
  image?: string;
  price?: number;
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
            isOffer1kgFree: false,
          },
        ];

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
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [badge, setBadge] = useState<string>("");
  const [variants, setVariants] = useState<VariantInput[]>([
    { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
    { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: false },
  ]);

  // Special Offer Form State
  const [hasOffer, setHasOffer] = useState<boolean>(false);
  const [offerBadge, setOfferBadge] = useState<string>("1kg Free Offer");
  const [offerBuyVariant, setOfferBuyVariant] = useState<string>("1kg");
  const [offerFreeVariant, setOfferFreeVariant] = useState<string>("0.5kg");

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
        setAlertMessage(`Admin user "${newAdminName}" created successfully.`);
        setShowUserModal(false);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        fetchAdminUsers();
      } else {
        alert(data.error || "Failed to create admin user.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
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

    return { totalRevenue, totalCount, avgOrderValue, paidOrders };
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
    setImage("");
    setImagePreview("");
    setImageError(null);
    setSelectedFile(null);
    setBadge("");
    setHasOffer(false);
    setOfferBadge("1kg Free Offer");
    setOfferBuyVariant("1kg");
    setOfferFreeVariant("0.5kg");
    setVariants([
      { name: "0.5kg", price: 450, weightValue: 0.5, weightUnit: "kg", isEggless: true, serves: "4-6 Servings", isOffer1kgFree: false },
      { name: "1kg", price: 850, weightValue: 1.0, weightUnit: "kg", isEggless: true, serves: "8-10 Servings", isOffer1kgFree: false },
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

    const existingImg = p.image || (p.imageName && (p.imageName.startsWith("data:") || p.imageName.startsWith("http") || p.imageName.startsWith("/")) ? p.imageName : "");
    setImage(existingImg || "");
    setImagePreview(existingImg || "");
    setImageError(null);
    setSelectedFile(null);
    
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

    setSelectedFile(file);

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
      };
      img.onload = () => {
        try {
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
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          const compressed = canvas.toDataURL(mime, 0.85);
          setImage(compressed);
          setImagePreview(compressed);
        } catch {
          setImage(rawDataUrl);
          setImagePreview(rawDataUrl);
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
      const updatedVariants = variants.map((v) => ({
        ...v,
        isOffer1kgFree: hasOffer && v.name.includes(offerBuyVariant),
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

      // Upload to server storage in PRODUCT_IMAGES if a new file was chosen
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("category", categorySlug);
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
        badge: hasOffer ? (offerBadge || "1kg Free Offer") : badge,
        rating: editingProduct?.rating || 5.0,
        reviewCount: editingProduct?.reviewCount || 1,
        productType: categorySlug === "snacks" ? "SNACK" : "CAKE",
        isActive: editingProduct ? editingProduct.isActive : true,
        variants: updatedVariants,
        offers: editingProduct?.offers || [],
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
        badge: hasOffer ? (offerBadge || "1kg Free Offer") : badge,
        hasOffer,
        offerBadge: hasOffer ? (offerBadge || "1kg Free Offer") : "",
        offerBuyVariant,
        offerFreeVariant,
        productType: categorySlug === "snacks" ? "SNACK" : "CAKE",
        isActive: true,
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
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage("Order status updated.");
        fetchOrders();
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

  // 🔒 LOGIN SCREEN (UNAUTHENTICATED VIEW)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C061E] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#2A082C] rounded-3xl border border-[#962854]/40 p-8 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#802B52]/40 border border-[#E6C184]/40 flex items-center justify-center mx-auto text-3xl shadow-lg">
              🔐
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Lollipop Admin Portal
            </h1>
            <p className="text-xs text-[#D8C3B3]">
              Sign in to manage your cake shop catalog and orders
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
                Admin Email
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

  // 🏆 AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2D2327]">
      {/* Admin Navbar Header */}
      <header className="bg-[#2A082C] border-b border-[#962854]/40 text-white px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#802B52] flex items-center justify-center text-xl shadow-md border border-[#E6C184]/30">
              🎂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide">
                  Lollipop Admin
                </h1>
              </div>
              <p className="text-xs text-[#D8C3B3]">
                Logged in as <strong className="text-white">{adminUser?.fullName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminUser?.role === "SUPERADMIN" && (
              <button
                onClick={handleOpenCreateModal}
                className="bg-[#E6C184] hover:bg-[#d8b070] text-[#2A082C] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                ➕ Add New Cake / Product
              </button>
            )}

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
            📊 Sales &amp; Overview
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
            📦 Customer Orders ({orders.length})
          </button>

          {adminUser?.role === "SUPERADMIN" && (
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
          )}
        </div>

        {/* TAB 1: SALES & OVERVIEW */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#5B1E38]">
                  Sales Overview
                </h2>
                <p className="text-xs text-[#7A6B72]">
                  View your store sales and order summary.
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
                  Total Revenue
                </span>
                <div className="text-3xl font-extrabold text-[#802B52]">
                  ₹{salesStats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">
                  💳 Total sales revenue
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Total Orders
                </span>
                <div className="text-3xl font-extrabold text-[#2A082C]">
                  {salesStats.totalCount} Orders
                </div>
                <p className="text-[11px] text-[#7A6B72] font-medium">
                  📦 Total orders placed
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Average Order Value
                </span>
                <div className="text-3xl font-extrabold text-[#962854]">
                  ₹{salesStats.avgOrderValue.toFixed(2)}
                </div>
                <p className="text-[11px] text-[#7A6B72] font-medium">
                  🎂 Average spend per order
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6DBCE] shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B72]">
                  Paid Orders
                </span>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {salesStats.paidOrders} / {salesStats.totalCount}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✅ Paid online
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
                  placeholder="Search products by name or code..."
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
                No products found matching your filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                                  className="px-2.5 py-1.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  🗑️
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
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-[#5B1E38]">
                Recent Customer Orders
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
                No customer orders recorded yet.
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
            )}
          </div>
        )}

        {/* TAB 4: MANAGE ADMIN USERS */}
        {adminUser?.role === "SUPERADMIN" && activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-[#E6DBCE] shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5B1E38]">
                  Admin Users
                </h2>
                <p className="text-xs text-[#7A6B72]">
                  Manage your admin team and staff accounts.
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
                    <th className="py-3 px-4">Status</th>
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
                          {u.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
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
                Add New Admin User
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
                  Password *
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
                  Role *
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E6DBCE] text-sm bg-white focus:outline-none focus:border-[#802B52]"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
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
                  {creatingUser ? "Saving..." : "Save Admin User"}
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
                <label className="block font-bold text-[#5B1E38] uppercase mb-1">
                  Cake Image (Optional)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6DBCE] rounded-lg bg-[#FAF5EE] hover:bg-[#F3E8DB] text-xs font-bold text-[#802B52] transition-colors">
                      <span>📷 {imagePreview ? "Change Image" : "Upload Cake Image"}</span>
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
                        className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                      >
                        ✕ Remove Image
                      </button>
                    )}
                  </div>

                  {imageError && (
                    <p className="text-[11px] text-red-600 font-medium">
                      ⚠️ {imageError}
                    </p>
                  )}

                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E6DBCE] bg-[#FAF5EE]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Cake preview"
                        className="w-full h-full object-cover"
                      />
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

              {/* Special Offers & Extra Weight Section */}
              <div className="border border-[#E6C184]/60 rounded-xl p-3 bg-[#FAF0F2] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-product-offer"
                      checked={hasOffer}
                      onChange={(e) => setHasOffer(e.target.checked)}
                      className="w-4 h-4 text-[#802B52] rounded focus:ring-[#802B52] cursor-pointer"
                    />
                    <label htmlFor="enable-product-offer" className="font-bold text-[#802B52] uppercase cursor-pointer">
                      🎁 Enable Special Offer (e.g. Buy 1kg Get 0.5kg Free)
                    </label>
                  </div>
                </div>

                {hasOffer && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5B1E38] uppercase mb-1">
                        Offer Badge / Title
                      </label>
                      <input
                        type="text"
                        value={offerBadge}
                        onChange={(e) => setOfferBadge(e.target.value)}
                        placeholder="e.g. 1kg Free Offer"
                        className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5B1E38] uppercase mb-1">
                        Required Buy Variant
                      </label>
                      <select
                        value={offerBuyVariant}
                        onChange={(e) => setOfferBuyVariant(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded bg-white text-xs"
                      >
                        {variants.map((v, i) => (
                          <option key={i} value={v.name}>
                            {v.name} (₹{v.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5B1E38] uppercase mb-1">
                        Free Bonus Extra Weight
                      </label>
                      <select
                        value={offerFreeVariant}
                        onChange={(e) => setOfferFreeVariant(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-[#E6DBCE] rounded bg-white text-xs"
                      >
                        {variants.map((v, i) => (
                          <option key={i} value={v.name}>
                            {v.name} (Free Extra)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
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
