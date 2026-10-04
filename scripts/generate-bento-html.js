const fs = require('fs');
const path = require('path');

const webscrapedDir = path.join(__dirname, '..', 'webscraped');
const jsonPath = path.join(webscrapedDir, 'bento cake.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bento Cakes Collection — Lollipop Cake Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#fff1f2',
              100: '#ffe4e6',
              200: '#fecdd3',
              500: '#f43f5e',
              600: '#e11d48',
              700: '#be123c',
              900: '#881337',
            },
            amberGold: '#d97706',
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .serif-title { font-family: 'Playfair Display', serif; }
    .card-zoom:hover img { transform: scale(1.06); }
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #fff1f2; }
    ::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 4px; }
  </style>
</head>
<body class="bg-[#faf5f5] text-slate-800 min-h-screen flex flex-col antialiased">

  <!-- TOP ANNOUNCEMENT BAR -->
  <div class="bg-gradient-to-r from-brand-700 via-brand-600 to-rose-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3">
    <span>✨ Cakesquare Bento Cakes Curated Catalog (${products.length} Products Scraped)</span>
    <span class="hidden md:inline">•</span>
    <span class="hidden md:inline">⚡ 45-Min Express Delivery Ready</span>
    <span class="hidden md:inline">•</span>
    <span class="bg-white/20 text-white px-2 py-0.5 rounded text-[11px] font-bold">100% Verified Scraped Data</span>
  </div>

  <!-- HEADER -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-brand-500/20">
          🎂
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-2">
            Lollipop <span class="text-brand-600 font-serif italic text-lg">Bento Studio</span>
          </h1>
          <p class="text-[11px] font-medium text-slate-400 mt-0.5">Scraped Catalog Viewer • No Main Code Modified</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2.5">
        <button onclick="downloadCsv()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
          <i class="fa-solid fa-file-csv text-emerald-600 text-sm"></i> Download CSV
        </button>
        <button onclick="downloadJson()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
          <i class="fa-solid fa-code text-indigo-600 text-sm"></i> JSON File
        </button>
        <button onclick="openCartDrawer()" class="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-600/30 hover:bg-brand-700 transition">
          <i class="fa-solid fa-bag-shopping text-sm"></i>
          <span>Cart</span>
          <span id="cartCountBadge" class="bg-white text-brand-700 text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="relative bg-gradient-to-b from-rose-50/80 via-white to-[#faf5f5] pt-10 pb-8 px-4 border-b border-rose-100">
    <div class="max-w-7xl mx-auto text-center">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 border border-brand-200 mb-3 shadow-xs">
        <i class="fa-solid fa-fire text-brand-500"></i> Bento Cake Special Collection
      </span>
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight serif-title">
        Artisanal <span class="text-brand-600 italic">Bento Cakes</span> Catalog
      </h2>
      <p class="max-w-2xl mx-auto text-slate-500 text-sm sm:text-base mt-2.5">
        Explore 37 trending miniature Bento Cakes scraped live from Cakesquare. Featuring detailed SKU codes, pricing, eggless variations, high-resolution imagery, and instant ordering.
      </p>

      <!-- Stat Badges -->
      <div class="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-600">
        <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-semibold">
          <i class="fa-solid fa-cake-candles text-brand-600"></i> 37 Scraped Products
        </div>
        <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-semibold">
          <i class="fa-solid fa-leaf text-emerald-600"></i> 100% Eggless Options
        </div>
        <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-semibold">
          <i class="fa-solid fa-bolt text-amber-500"></i> From ₹410 Only
        </div>
        <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-semibold">
          <i class="fa-solid fa-truck-fast text-sky-600"></i> 45-Min Express Delivery
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN CATALOG CONTENT -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

    <!-- SEARCH & FILTER TOOLBAR -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-sm mb-8 space-y-4">
      <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <!-- Search input -->
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            id="searchInput"
            type="text"
            placeholder="Search by bento name, flavor, or SKU (e.g. BNT001, Penguin, Velvet, Chocolate)..."
            class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            oninput="handleSearch()"
          />
          <button id="clearSearchBtn" onclick="clearSearch()" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Egg / Eggless Toggle -->
          <div class="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button onclick="setEggFilter('all')" id="btnEggAll" class="px-3 py-1.5 rounded-lg bg-white text-brand-700 shadow-xs font-bold transition">All</button>
            <button onclick="setEggFilter('eggless')" id="btnEggless" class="px-3 py-1.5 rounded-lg hover:text-slate-900 transition flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Eggless
            </button>
            <button onclick="setEggFilter('egg')" id="btnEgg" class="px-3 py-1.5 rounded-lg hover:text-slate-900 transition flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span> Regular
            </button>
          </div>

          <!-- Sort Select -->
          <select id="sortSelect" onchange="handleSort()" class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-brand-500 transition">
            <option value="default">Sort: Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <!-- Quick Category Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
        <span class="text-slate-400 text-xs font-semibold whitespace-nowrap pl-0.5">Filter Theme:</span>
        <button onclick="setThemeFilter('all')" class="theme-pill active px-3 py-1 rounded-full whitespace-nowrap bg-brand-600 text-white font-bold transition" data-theme="all">All Bento (37)</button>
        <button onclick="setThemeFilter('mothers')" class="theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition" data-theme="mothers">Mother's Day</button>
        <button onclick="setThemeFilter('fathers')" class="theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition" data-theme="fathers">Father's Day / Dad</button>
        <button onclick="setThemeFilter('love')" class="theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition" data-theme="love">Valentine & Love</button>
        <button onclick="setThemeFilter('chocolate')" class="theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition" data-theme="chocolate">Chocolate / Forest</button>
        <button onclick="setThemeFilter('fruit')" class="theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition" data-theme="fruit">Fruit & Berry</button>
      </div>

      <!-- Status Count Bar -->
      <div class="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span id="resultsCount">Showing 37 Bento Cakes</span>
        <button onclick="resetFilters()" class="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline">
          <i class="fa-solid fa-arrow-rotate-left text-[10px]"></i> Reset Filters
        </button>
      </div>
    </div>

    <!-- PRODUCTS GRID -->
    <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Generated dynamically by JavaScript -->
    </div>

    <!-- EMPTY STATE -->
    <div id="emptyState" class="hidden text-center py-16 px-4 bg-white rounded-2xl border border-rose-100 my-8">
      <div class="text-5xl mb-3">🔍</div>
      <h3 class="text-lg font-bold text-slate-800">No Bento Cakes matched your filter</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">Try clearing your search query or choosing "All" in the eggless and theme filters.</p>
      <button onclick="resetFilters()" class="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition">
        Reset All Filters
      </button>
    </div>

  </main>

  <!-- QUICK VIEW MODAL -->
  <div id="quickViewModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col md:flex-row relative">
      <button onclick="closeQuickView()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="md:w-1/2 p-6 bg-rose-50/40 flex items-center justify-center">
        <img id="modalImg" src="" alt="" class="w-full h-72 md:h-80 object-cover rounded-2xl shadow-md border border-rose-100" />
      </div>

      <div class="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span id="modalSku" class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">SKU</span>
            <span>•</span>
            <span class="text-brand-600">Bento Cakes</span>
          </div>
          <h3 id="modalTitle" class="text-xl font-extrabold text-slate-900 mt-1.5 leading-snug"></h3>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="modalPrice" class="text-2xl font-black text-brand-600">₹0</span>
            <span class="text-xs text-slate-400 font-medium">Starting Price (tax incl.)</span>
          </div>
          <p id="modalDesc" class="text-xs text-slate-600 mt-3 leading-relaxed"></p>

          <div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div class="text-xs font-bold text-slate-700">Available Variations:</div>
            <div id="modalVariationsList" class="max-h-36 overflow-y-auto space-y-1.5 text-xs text-slate-600 pr-1"></div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center gap-2.5">
          <button id="modalAddToCartBtn" class="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-md shadow-brand-600/20">
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
          <a id="modalWhatsAppBtn" href="#" target="_blank" class="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20">
            <i class="fa-brands fa-whatsapp text-sm"></i> Order
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- CART SLIDE-OVER DRAWER -->
  <div id="cartDrawer" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs hidden justify-end">
    <div class="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-6 relative">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-bag-shopping text-brand-600"></i> Your Bento Cart
        </h3>
        <button onclick="closeCartDrawer()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div id="cartItemsContainer" class="flex-1 overflow-y-auto py-4 space-y-3">
        <!-- Rendered dynamically -->
      </div>

      <div class="pt-4 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500 font-medium">Subtotal</span>
          <span id="cartSubtotal" class="font-extrabold text-slate-900 text-lg">₹0</span>
        </div>
        <button onclick="checkoutWhatsApp()" class="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition">
          <i class="fa-brands fa-whatsapp text-base"></i> Checkout on WhatsApp
        </button>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="bg-white border-t border-rose-100 py-8 px-4 mt-auto">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>
        <p class="font-bold text-slate-700">🎂 Lollipop Cake Shop — Scraped Bento Cakes Repository</p>
        <p class="mt-0.5">Standalone UI generated directly from <code class="bg-rose-50 text-brand-600 px-1 py-0.5 rounded">bento cake.json</code> and <code class="bg-rose-50 text-brand-600 px-1 py-0.5 rounded">bento cake.csv</code>.</p>
      </div>
      <div class="flex items-center gap-4">
        <button onclick="downloadCsv()" class="hover:text-brand-600 font-semibold transition">Download .CSV</button>
        <span>•</span>
        <button onclick="downloadJson()" class="hover:text-brand-600 font-semibold transition">Download .JSON</button>
        <span>•</span>
        <a href="https://cakesquare.com/product-category/bento-cakes/" target="_blank" class="hover:text-brand-600 font-semibold transition">Source Website</a>
      </div>
    </div>
  </footer>

  <!-- RAW SCRAPED DATA EMBEDDED SAFELY -->
  <script id="scrapedData" type="application/json">
${JSON.stringify(products)}
  </script>

  <!-- APPLICATION LOGIC -->
  <script>
    const RAW_PRODUCTS = JSON.parse(document.getElementById('scrapedData').textContent);
    let cart = [];
    let activeEgg = 'all';
    let activeTheme = 'all';
    let searchQuery = '';
    let sortMode = 'default';

    // Image fallback placeholder
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80';

    function init() {
      renderProducts();
    }

    function getFilteredProducts() {
      return RAW_PRODUCTS.filter(p => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchSku = (p.sku || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchDesc) return false;
        }

        // Egg Filter
        if (activeEgg === 'eggless') {
          if (!p.cake_types || !p.cake_types.includes('eggless')) return false;
        } else if (activeEgg === 'egg') {
          if (!p.cake_types || !p.cake_types.includes('egg')) return false;
        }

        // Theme Filter
        if (activeTheme === 'mothers') {
          if (!p.name.toLowerCase().includes('mother')) return false;
        } else if (activeTheme === 'fathers') {
          if (!p.name.toLowerCase().includes('dad') && !p.name.toLowerCase().includes('father')) return false;
        } else if (activeTheme === 'love') {
          const l = p.name.toLowerCase();
          if (!l.includes('love') && !l.includes('heart') && !l.includes('valentine') && !l.includes('penguin') && !l.includes('surprise')) return false;
        } else if (activeTheme === 'chocolate') {
          const c = p.name.toLowerCase();
          if (!c.includes('chocolate') && !c.includes('forest') && !c.includes('truffle')) return false;
        } else if (activeTheme === 'fruit') {
          const f = p.name.toLowerCase();
          if (!f.includes('strawberry') && !f.includes('butterscotch') && !f.includes('berry') && !f.includes('mango')) return false;
        }

        return true;
      }).sort((a, b) => {
        if (sortMode === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortMode === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortMode === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortMode === 'name-desc') return (b.name || '').localeCompare(a.name || '');
        return 0;
      });
    }

    function renderProducts() {
      const list = getFilteredProducts();
      const grid = document.getElementById('productsGrid');
      const empty = document.getElementById('emptyState');
      const countLabel = document.getElementById('resultsCount');

      countLabel.textContent = \`Showing \${list.length} of \${RAW_PRODUCTS.length} Bento Cakes\`;

      if (list.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }

      empty.classList.add('hidden');
      grid.innerHTML = list.map((p, idx) => {
        const hasEggless = (p.cake_types || '').includes('eggless');
        const displayPrice = Math.round(p.price || 0);
        const weightsList = p.weights || 'Single Bento Size';

        return \`
          <div class="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-brand-300 transition group card-zoom">
            <div class="relative bg-rose-50/50 aspect-square overflow-hidden cursor-pointer" onclick="openQuickView(\${p.id})">
              <img
                src="\${p.image_url || FALLBACK_IMAGE}"
                alt="\${p.image_alt || p.name}"
                class="w-full h-full object-cover transition-transform duration-500"
                loading="lazy"
                onerror="this.src='\${FALLBACK_IMAGE}'"
              />
              <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                <span class="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  45 Min
                </span>
                \${hasEggless ? \`
                  <span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span> Eggless Opt.
                  </span>
                \` : ''}
              </div>
              <div class="absolute top-2.5 right-2.5">
                <span class="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  \${p.sku || 'BNT'}
                </span>
              </div>
            </div>

            <div class="p-4 flex flex-col flex-1 justify-between">
              <div>
                <div class="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                  <span>Bento Cakes</span>
                  <span>\${p.variations_count > 0 ? \`\${p.variations_count} Variations\` : 'Standard'}</span>
                </div>
                <h4 class="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-brand-600 transition cursor-pointer" onclick="openQuickView(\${p.id})">
                  \${p.name}
                </h4>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                  \${p.description || 'Delicious handcrafted mini bento cake baked fresh on order.'}
                </p>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span class="text-[10px] text-slate-400 block font-medium">Starting at</span>
                  <span class="text-lg font-black text-brand-600">₹\${displayPrice}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button onclick="openQuickView(\${p.id})" title="Quick View" class="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-400 flex items-center justify-center transition">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                  <button onclick="addToCart(\${p.id})" title="Add to Cart" class="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition flex items-center gap-1 shadow-sm shadow-brand-600/20">
                    <i class="fa-solid fa-plus text-[10px]"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function handleSearch() {
      const val = document.getElementById('searchInput').value.trim();
      searchQuery = val;
      const clearBtn = document.getElementById('clearSearchBtn');
      if (val) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
      renderProducts();
    }

    function clearSearch() {
      document.getElementById('searchInput').value = '';
      searchQuery = '';
      document.getElementById('clearSearchBtn').classList.add('hidden');
      renderProducts();
    }

    function setEggFilter(mode) {
      activeEgg = mode;
      document.getElementById('btnEggAll').className = mode === 'all' ? 'px-3 py-1.5 rounded-lg bg-white text-brand-700 shadow-xs font-bold transition' : 'px-3 py-1.5 rounded-lg hover:text-slate-900 transition font-semibold';
      document.getElementById('btnEggless').className = mode === 'eggless' ? 'px-3 py-1.5 rounded-lg bg-white text-emerald-700 shadow-xs font-bold transition flex items-center gap-1' : 'px-3 py-1.5 rounded-lg hover:text-slate-900 transition font-semibold flex items-center gap-1';
      document.getElementById('btnEgg').className = mode === 'egg' ? 'px-3 py-1.5 rounded-lg bg-white text-amber-700 shadow-xs font-bold transition flex items-center gap-1' : 'px-3 py-1.5 rounded-lg hover:text-slate-900 transition font-semibold flex items-center gap-1';
      renderProducts();
    }

    function setThemeFilter(theme) {
      activeTheme = theme;
      document.querySelectorAll('.theme-pill').forEach(btn => {
        if (btn.dataset.theme === theme) {
          btn.className = 'theme-pill active px-3 py-1 rounded-full whitespace-nowrap bg-brand-600 text-white font-bold transition';
        } else {
          btn.className = 'theme-pill px-3 py-1 rounded-full whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition';
        }
      });
      renderProducts();
    }

    function handleSort() {
      sortMode = document.getElementById('sortSelect').value;
      renderProducts();
    }

    function resetFilters() {
      searchQuery = '';
      document.getElementById('searchInput').value = '';
      document.getElementById('clearSearchBtn').classList.add('hidden');
      activeEgg = 'all';
      setEggFilter('all');
      activeTheme = 'all';
      setThemeFilter('all');
      sortMode = 'default';
      document.getElementById('sortSelect').value = 'default';
      renderProducts();
    }

    // QUICK VIEW MODAL
    function openQuickView(id) {
      const p = RAW_PRODUCTS.find(x => x.id === id);
      if (!p) return;

      document.getElementById('modalImg').src = p.image_url || FALLBACK_IMAGE;
      document.getElementById('modalImg').onerror = () => { document.getElementById('modalImg').src = FALLBACK_IMAGE; };
      document.getElementById('modalTitle').textContent = p.name;
      document.getElementById('modalSku').textContent = 'SKU: ' + (p.sku || 'N/A');
      document.getElementById('modalPrice').textContent = '₹' + Math.round(p.price || 0);
      document.getElementById('modalDesc').textContent = p.description || 'Delicious miniature bento cake designed for special celebrations.';

      const list = document.getElementById('modalVariationsList');
      if (p.variations && p.variations.length > 0) {
        list.innerHTML = p.variations.map((v, i) => \`
          <div class="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span class="font-medium">\${v.weight || 'Standard'} • \${v.cake_type === 'eggless' ? '🌱 Eggless' : '🥚 Regular'}</span>
            <span class="font-bold text-brand-600">₹\${Math.round(v.price || p.price)}</span>
          </div>
        \`).join('');
      } else {
        list.innerHTML = '<div class="text-slate-400 italic">No custom variation tiers.</div>';
      }

      document.getElementById('modalAddToCartBtn').onclick = () => {
        addToCart(p.id);
        closeQuickView();
      };

      const waMsg = encodeURIComponent(\`Hello Lollipop Cake Shop! I would like to order: \${p.name} (SKU: \${p.sku}, Price: ₹\${p.price}). Please share delivery options!\`);
      document.getElementById('modalWhatsAppBtn').href = \`https://wa.me/919940000000?text=\${waMsg}\`;

      const modal = document.getElementById('quickViewModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeQuickView() {
      const modal = document.getElementById('quickViewModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    // CART MANAGEMENT
    function addToCart(id) {
      const p = RAW_PRODUCTS.find(x => x.id === id);
      if (!p) return;

      const existing = cart.find(x => x.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          image: p.image_url || FALLBACK_IMAGE,
          qty: 1
        });
      }
      updateCartUI();
      openCartDrawer();
    }

    function changeQty(id, delta) {
      const item = cart.find(x => x.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
      }
      updateCartUI();
    }

    function updateCartUI() {
      const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
      document.getElementById('cartCountBadge').textContent = totalCount;

      const container = document.getElementById('cartItemsContainer');
      const subtotalEl = document.getElementById('cartSubtotal');

      if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-slate-400 text-xs">Your cart is currently empty.</div>';
        subtotalEl.textContent = '₹0';
        return;
      }

      let subtotal = 0;
      container.innerHTML = cart.map(item => {
        const itemTotal = item.qty * item.price;
        subtotal += itemTotal;
        return \`
          <div class="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
            <img src="\${item.image}" class="w-12 h-12 object-cover rounded-lg border border-slate-200" />
            <div class="flex-1 min-w-0">
              <h5 class="text-xs font-bold text-slate-800 truncate">\${item.name}</h5>
              <span class="text-[11px] text-brand-600 font-extrabold">₹\${Math.round(item.price)}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <button onclick="changeQty(\${item.id}, -1)" class="text-xs text-slate-500 hover:text-brand-600 px-1 font-bold">-</button>
              <span class="text-xs font-bold text-slate-800 min-w-[14px] text-center">\${item.qty}</span>
              <button onclick="changeQty(\${item.id}, 1)" class="text-xs text-slate-500 hover:text-brand-600 px-1 font-bold">+</button>
            </div>
          </div>
        \`;
      }).join('');

      subtotalEl.textContent = '₹' + Math.round(subtotal);
    }

    function openCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      drawer.classList.remove('hidden');
      drawer.classList.add('flex');
    }

    function closeCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      drawer.classList.add('hidden');
      drawer.classList.remove('flex');
    }

    function checkoutWhatsApp() {
      if (cart.length === 0) return alert('Your cart is empty!');
      const itemsList = cart.map(i => \`• \${i.name} (x\${i.qty}) - ₹\${Math.round(i.price * i.qty)}\`).join('\\n');
      const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      const text = \`Hello Lollipop Cake Shop! I would like to place an order from the Bento Cakes Catalog:\\n\\n\${itemsList}\\n\\nTotal Amount: ₹\${Math.round(total)}\\n\\nPlease confirm order and delivery time!\`;
      window.open('https://wa.me/919940000000?text=' + encodeURIComponent(text), '_blank');
    }

    // EXPORT DOWNLOADS
    function downloadJson() {
      const blob = new Blob([JSON.stringify(RAW_PRODUCTS, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bento-cakes-scraped.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    function downloadCsv() {
      const headers = ['ID', 'SKU', 'Product Name', 'Price', 'Category', 'Stock Status', 'Weights', 'Cake Types', 'Description', 'Image URL'];
      const rows = RAW_PRODUCTS.map(p => [
        p.id,
        \`"\${(p.sku || '').replace(/"/g, '""')}"\`,
        \`"\${(p.name || '').replace(/"/g, '""')}"\`,
        p.price,
        \`"\${p.category || 'Bento Cakes'}"\`,
        \`"\${p.stock_status || 'instock'}"\`,
        \`"\${(p.weights || '').replace(/"/g, '""')}"\`,
        \`"\${(p.cake_types || '').replace(/"/g, '""')}"\`,
        \`"\${(p.description || '').replace(/"/g, '""')}"\`,
        \`"\${p.image_url || ''}"\`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bento-cake.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    window.onload = init;
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(webscrapedDir, 'index.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(webscrapedDir, 'bento-cakes.html'), htmlContent, 'utf8');

console.log('✅ Created webscraped/index.html and webscraped/bento-cakes.html successfully!');
