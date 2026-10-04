const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper to fetch URL with retry and timeout
function fetchUrl(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 20000,
      },
      (res) => {
        // Handle HTTP redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrl(res.headers.location, retries - 1));
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );

    req.on('timeout', () => {
      req.destroy();
      if (retries > 0) {
        setTimeout(() => resolve(fetchUrl(url, retries - 1)), 1000);
      } else {
        reject(new Error(`Timeout fetching ${url}`));
      }
    });

    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => resolve(fetchUrl(url, retries - 1)), 1000);
      } else {
        reject(err);
      }
    });
  });
}

// Decode basic HTML entities
function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8377;/g, '₹')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Escape field for CSV
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Concurrency pool runner
async function asyncPool(limit, items, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

async function scrapeBentoCakes() {
  console.log('🚀 [Scraper] Starting Bento Cakes scraper for Cakesquare...');
  const baseUrl = 'https://cakesquare.com/product-category/bento-cakes/';

  // 1. Discover all pagination pages
  const categoryPages = [baseUrl];
  let pageNum = 2;
  while (true) {
    const pageUrl = `${baseUrl}page/${pageNum}/`;
    try {
      const res = await fetchUrl(pageUrl);
      if (res.status === 200) {
        categoryPages.push(pageUrl);
        pageNum++;
      } else {
        break; // Reached end of pagination (e.g. 404)
      }
    } catch {
      break;
    }
  }

  console.log(`📦 [Scraper] Discovered ${categoryPages.length} category page(s). Fetching catalog listings...`);

  // 2. Extract product items from category pages
  const catalogProducts = [];
  for (const catUrl of categoryPages) {
    console.log(`🔍 [Scraper] Fetching listing from: ${catUrl}`);
    const res = await fetchUrl(catUrl);
    const html = res.data;

    const gtmRegex = /data-gtm4wp_product_data="([^"]+)"/g;
    let match;
    while ((match = gtmRegex.exec(html)) !== null) {
      try {
        const rawJson = match[1].replace(/&quot;/g, '"');
        const item = JSON.parse(rawJson);
        catalogProducts.push(item);
      } catch (err) {
        console.warn('⚠️ [Scraper] Error parsing listing item JSON:', err.message);
      }
    }
  }

  console.log(`✅ [Scraper] Found ${catalogProducts.length} total Bento Cake products!`);

  // 3. Fetch detailed data for each product page
  console.log('📥 [Scraper] Fetching individual product pages for rich metadata & variations...');
  let completed = 0;

  const detailedProducts = await asyncPool(4, catalogProducts, async (item) => {
    const prodUrl = item.productlink || `https://cakesquare.com/product/${item.id}/`;
    let details = {
      id: item.internal_id || item.id,
      sku: item.sku || item.item_id || '',
      name: decodeHtml(item.item_name || ''),
      price: item.price || 0,
      category: item.item_category || 'Bento Cakes',
      stock_status: item.stockstatus || 'instock',
      product_url: prodUrl,
      image_url: '',
      image_alt: '',
      description: '',
      weights: '',
      cake_types: '',
      variations_count: 0,
      variations: [],
    };

    try {
      const res = await fetchUrl(prodUrl);
      const pHtml = res.data;

      // Extract high-res image
      const ogImg = pHtml.match(/<meta property="og:image" content="([^"]*)"/i);
      const imgMatch = pHtml.match(/class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]*)"/i);
      details.image_url = ogImg ? ogImg[1] : (imgMatch ? imgMatch[1] : '');

      // Extract image alt
      const altMatch = pHtml.match(/class="[^"]*wp-post-image[^"]*"[^>]*alt="([^"]*)"/i);
      details.image_alt = altMatch ? decodeHtml(altMatch[1]) : details.name;

      // Extract description
      const ogDesc = pHtml.match(/<meta property="og:description" content="([^"]*)"/i);
      const metaDesc = pHtml.match(/<meta name="description" content="([^"]*)"/i);
      const shortDesc = pHtml.match(/class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

      if (ogDesc && ogDesc[1]) {
        details.description = decodeHtml(ogDesc[1]);
      } else if (metaDesc && metaDesc[1]) {
        details.description = decodeHtml(metaDesc[1]);
      } else if (shortDesc && shortDesc[1]) {
        details.description = decodeHtml(shortDesc[1].replace(/<[^>]+>/g, ''));
      }

      // Extract variations (weights, egg/eggless, pricing)
      const varMatch = pHtml.match(/data-product_variations="([^"]+)"/);
      if (varMatch) {
        const decoded = varMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        const vars = JSON.parse(decoded);
        details.variations_count = vars.length;

        const weights = new Set();
        const types = new Set();

        details.variations = vars.map((v) => {
          const w = v.attributes?.attribute_pa_weight || v.attributes?.weight || '';
          const t = v.attributes?.['attribute_pa_cake-type'] || v.attributes?.cake_type || '';
          if (w) weights.add(w);
          if (t) types.add(t);

          return {
            variation_id: v.variation_id,
            sku: v.sku,
            price: v.display_price,
            weight: w,
            cake_type: t,
            is_in_stock: v.is_in_stock,
            image_url: v.image?.url || v.image?.src || '',
          };
        });

        details.weights = Array.from(weights).join(', ');
        details.cake_types = Array.from(types).join(', ');
      }
    } catch (err) {
      console.warn(`⚠️ [Scraper] Failed to fetch full details for ${prodUrl}:`, err.message);
    }

    completed++;
    process.stdout.write(`\r[Scraper] Progress: ${completed}/${catalogProducts.length} completed`);
    return details;
  });

  console.log('\n✨ [Scraper] Successfully collected all Bento Cake product records!');

  // 4. Save to webscraped/ directory
  const targetDir = path.join(__dirname, '..', 'webscraped');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Define CSV Headers
  const csvHeaders = [
    'ID',
    'SKU',
    'Product Name',
    'Price (INR)',
    'Category',
    'Stock Status',
    'Available Weights',
    'Cake Types (Egg/Eggless)',
    'Description',
    'Product URL',
    'Image URL',
    'Image Alt Text',
    'Variations Count',
    'Variations Details (JSON)',
  ];

  // Convert to CSV
  const csvRows = [
    csvHeaders.join(','),
    ...detailedProducts.map((p) =>
      [
        escapeCsv(p.id),
        escapeCsv(p.sku),
        escapeCsv(p.name),
        escapeCsv(p.price),
        escapeCsv(p.category),
        escapeCsv(p.stock_status),
        escapeCsv(p.weights),
        escapeCsv(p.cake_types),
        escapeCsv(p.description),
        escapeCsv(p.product_url),
        escapeCsv(p.image_url),
        escapeCsv(p.image_alt),
        escapeCsv(p.variations_count),
        escapeCsv(JSON.stringify(p.variations)),
      ].join(',')
    ),
  ];

  const csvContent = csvRows.join('\r\n');

  // Write both "bento cake.csv" and "bento-cake.csv" (and JSON for convenience)
  const csvPath1 = path.join(targetDir, 'bento cake.csv');
  const csvPath2 = path.join(targetDir, 'bento-cake.csv');
  const jsonPath = path.join(targetDir, 'bento cake.json');

  fs.writeFileSync(csvPath1, csvContent, 'utf8');
  fs.writeFileSync(csvPath2, csvContent, 'utf8');
  fs.writeFileSync(jsonPath, JSON.stringify(detailedProducts, null, 2), 'utf8');

  console.log(`\n🎉 [Scraper Done] Successfully saved:`);
  console.log(`   📄 ${csvPath1} (${(csvContent.length / 1024).toFixed(1)} KB)`);
  console.log(`   📄 ${csvPath2}`);
  console.log(`   📄 ${jsonPath}`);
  console.log(`\nSample First Row:\n- Name: ${detailedProducts[0]?.name}\n- SKU: ${detailedProducts[0]?.sku}\n- Price: ₹${detailedProducts[0]?.price}\n- Image: ${detailedProducts[0]?.image_url}\n- Weights: ${detailedProducts[0]?.weights}\n- Types: ${detailedProducts[0]?.cake_types}`);
}

scrapeBentoCakes().catch((err) => {
  console.error('❌ [Scraper Fatal Error]:', err);
  process.exit(1);
});
