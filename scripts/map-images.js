const fs = require('fs');
const path = require('path');

const rawProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/products-data.json'), 'utf8'));
const cakeFiles = fs.readdirSync(path.join(__dirname, '../public/images/Cakes'));
const snackFiles = fs.readdirSync(path.join(__dirname, '../public/images/Snacks'));

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const cakeMap = new Map();
cakeFiles.forEach(f => {
  const nameWithoutExt = path.parse(f).name;
  cakeMap.set(normalize(nameWithoutExt), f);
});

const snackMap = new Map();
snackFiles.forEach(f => {
  const nameWithoutExt = path.parse(f).name;
  snackMap.set(normalize(nameWithoutExt), f);
});

// Manual overrides for exact match mapping
const manualMap = {
  // Cakes
  "Black Forest": "/images/Cakes/black_forest.jpg",
  "White Forest": "/images/Cakes/white_forest.jpg",
  "Butter Scotch": "/images/Cakes/butter_scotch.jpg",
  "Mango": "/images/Cakes/mango.jpg",
  "Black Currant": "/images/Cakes/black_currant.jpg",
  "Strawberry": "/images/Cakes/strawberry.jpg",
  "Pineapple": "/images/Cakes/pineapple.jpg",
  "Blueberry": "/images/Cakes/blueberry.jpg",
  "Kiwi": "/images/Cakes/kiwi.jpg",
  "Iris Coffee": "/images/Cakes/iris_coffee.jpg",
  "Chocolate": "/images/Cakes/chocolate.jpg",
  "Choco Truffle": "/images/Cakes/choco_truffle.jpg",
  "Choco Almond": "/images/Cakes/choco_almond.jpg",
  "Choco Nuts": "/images/Cakes/choco_nuts.jpg",
  "Choco Oreo": "/images/Cakes/choco_oreo.jpg",
  "Choco Delight": "/images/Cakes/choco_delight.jpg",
  "Choco Kit Kat": "/images/Cakes/choco_kit_kat.jpg",
  "Choco Vanilla": "/images/Cakes/choco_vanilla.jpg",
  "Choco Strawberry": "/images/Cakes/choco_strawberry.jpg",
  "2 In 1 Fruit Cake Flavour": "/images/Cakes/2_in_1_fruit_cake_flavour.jpg",
  "3 In 1 Fruit Cake Flavour": "/images/Cakes/3_in_1_fruit_cake_flavour.jpg",
  "Nutty Choco Truffle": "/images/Cakes/nutty_choco_truffle.jpg",
  "Nutty Ferrero Truffle": "/images/Cakes/nutty_ferrero_truffle.jpg",
  "Ferrero Rocher": "/images/Cakes/ferrero_rocher.jpg",
  "Ferrero Truffle": "/images/Cakes/ferrero_truffle.jpg",
  "Gulab Jamun": "/images/Cakes/gulab_jamun.jpg",
  "Rasagulla": "/images/Cakes/rasagulla.jpg",
  "Rasamalai": "/images/Cakes/rasamalai.jpg",
  "Red Velvet": "/images/Cakes/red_velvet.jpg",
  "Spanish Delight": "/images/Cakes/spanish_delight.jpg",
  "Tender Coconut": "/images/Cakes/tender_coconut.jpg",
  "Vancho": "/images/Cakes/vancho.jpg",
  "Pista": "/images/Cakes/pista.jpg",
  "Lotus Biscoff": "/images/Cakes/louts_biscoff.jpg",
  "Louts Biscoff": "/images/Cakes/louts_biscoff.jpg",
  "Nutella": "/images/Cakes/nutella.jpg",
  "Nutty Bubble": "/images/Cakes/nutty_bubble.jpg",
  "Fudge Nut": "/images/Cakes/fudge_nut.jpg",
  "Raffaello Cake": "/images/Cakes/raffaello_cake.jpg",
  "Red Bee": "/images/Cakes/red_bee.jpg",
  "Fruit Fantacy": "/images/Cakes/fruit_fantacy.jpg",
  "Milky Truffle": "/images/Cakes/milky_truffle.jpg",
  "Choco Snickers": "/images/Cakes/choco_snickers.jpg",
  "Choco Redvelvet": "/images/Cakes/choco_redvelvet.jpg",
  "Choco Fantacy": "/images/Cakes/choco_fantacy.jpg",
  "Caramel": "/images/Cakes/caramel.jpg",

  // Snacks & Bakery items
  "Normal Brownie": "/images/Snacks/normal_brownie.jpg",
  "Walnut Brownie": "/images/Snacks/walnut_brownie.jpg",
  "Kit Kat Brownie": "/images/Snacks/kit_kat_brownie.jpg",
  "KitKat Brownie": "/images/Snacks/kit_kat_brownie.jpg",
  "Double Choco Chip Brownie": "/images/Snacks/double_choco_chip_brownie.jpg",
  "Pistachio Brownie": "/images/Snacks/pistachio_brownie.jpg",
  "White Chocolate Brownie": "/images/Snacks/white_chocolate_brownie.jpg",
  "Caramel Brownie": "/images/Snacks/caramel_brownie.jpg",
  "Biscoff Blondie": "/images/Snacks/biscoff_blondie.jpg",
  "Doughnut": "/images/Snacks/doughnut.jpg",
  "Plain Doughnut": "/images/Snacks/doughnut.jpg",
  "Choco Filled Doughnut": "/images/Snacks/choco_filled_doughnut.jpg",
  "Cream Doughnut": "/images/Snacks/cream_doughnut.jpg",
  "Banana Cupcake": "/images/Snacks/banana_cupcake.jpg",
  "Choco Chips Cupcake": "/images/Snacks/choco_chips_cupcake.jpg",
  "Strawberry Cupcake": "/images/Snacks/strawberry_cupcake.jpg",
  "Blueberry Cupcake": "/images/Snacks/blueberry_cupcake.jpg",
  "Orange Cupcake": "/images/Snacks/orange_cupcake.jpg",
  "Fruit Cupcake": "/images/Snacks/fruit_cupcake.jpg",
  "Carrot Cupcake": "/images/Snacks/carrot_cupcake.jpg",
  "Butter Cookies": "/images/Snacks/butter_cookies.jpg",
  "Cashew Cookies": "/images/Snacks/cashew_cookies.jpg",
  "Almond Cookies": "/images/Snacks/almond_cookies.jpg",
  "Choco Chips Cookies": "/images/Snacks/choco_chips_cookies.jpg",
  "Coconut Cookies": "/images/Snacks/coconut_cookies.jpg",
  "Salt Cookies": "/images/Snacks/salt_cookies.jpg",
  "Veg Puff": "/images/Snacks/veg_puff.jpg",
  "Egg Puff": "/images/Snacks/egg_puff.jpg",
  "Chicken Puff": "/images/Snacks/chicken_puff.jpg",
  "Paneer Puff": "/images/Snacks/paneer_puff.jpg",
  "Mushroom Puff": "/images/Snacks/mushroom_puff.jpg",
  "Plain Bun": "/images/Snacks/plain_bun.jpg",
  "Cream Bun": "/images/Snacks/cream_bun.jpg",
  "Jam Bun": "/images/Snacks/jam_bun.jpg",
  "Coconut Bun": "/images/Snacks/coconut_bun.jpg",
  "Burger Bun": "/images/Snacks/burger_bun.jpg",
  "Mini Bun": "/images/Snacks/mini_bun_snack.jpg",
  "Mini Bun (8 No)": "/images/Snacks/mini_bun_8_nos.jpg",
  "Burger Bun (4 Nos)": "/images/Snacks/burger_bun.jpg",
  "Sandwich Bread": "/images/Snacks/sandwich_bread.jpg",
  "Sweet Bread": "/images/Snacks/sweet_bread.jpg",
  "Wheat Bread": "/images/Snacks/wheat_bread.jpg",
  "Multi Grain Bread": "/images/Snacks/multi_grain_bread.jpg",
  "Pizza Base": "/images/Snacks/pizza_base.jpg",
  "Plum Cake": "/images/Snacks/plum_cake.jpg",
  "Rich Plum Cake": "/images/Snacks/rich_plum_cake.jpg",
  "Plain Cake": "/images/Snacks/plain_cake.jpg",
  "Tea Cake": "/images/Snacks/tea_cake.jpg",
  "Banana Cake": "/images/Snacks/banana_cake.jpg",
  "Banana Choco Chips Cake": "/images/Snacks/banana_choco_chips_cake.jpg",
  "Banana Walnut Cake": "/images/Snacks/banana_walnut_cake.jpg",
  "Pudding Cake": "/images/Snacks/pudding_cake.jpg"
};

let matchCount = 0;
let missing = [];

const updatedProducts = rawProducts.map(p => {
  const name = p.name ? p.name.trim() : '';
  const baseName = p.baseName ? p.baseName.trim() : '';
  const normName = normalize(name);
  const normBase = normalize(baseName);

  let img = null;

  if (manualMap[name]) {
    img = manualMap[name];
  } else if (manualMap[baseName]) {
    img = manualMap[baseName];
  } else if (cakeMap.has(normName)) {
    img = `/images/Cakes/${cakeMap.get(normName)}`;
  } else if (cakeMap.has(normBase)) {
    img = `/images/Cakes/${cakeMap.get(normBase)}`;
  } else if (snackMap.has(normName)) {
    img = `/images/Snacks/${snackMap.get(normName)}`;
  } else if (snackMap.has(normBase)) {
    img = `/images/Snacks/${snackMap.get(normBase)}`;
  } else {
    // Try partial matching
    for (const [key, fn] of cakeMap.entries()) {
      if (normName.includes(key) || key.includes(normName)) {
        img = `/images/Cakes/${fn}`;
        break;
      }
    }
    if (!img) {
      for (const [key, fn] of snackMap.entries()) {
        if (normName.includes(key) || key.includes(normName)) {
          img = `/images/Snacks/${fn}`;
          break;
        }
      }
    }
  }

  if (img) {
    matchCount++;
    return { ...p, image: img };
  } else {
    missing.push(`${p.name} (id: ${p.id}, cat: ${p.category})`);
    return p;
  }
});

console.log(`Successfully mapped ${matchCount}/${rawProducts.length} items to real local image files.`);
if (missing.length > 0) {
  console.log("Missing items:", missing);
} else {
  console.log("ALL products have been matched 100%!");
}

fs.writeFileSync(path.join(__dirname, '../lib/products-data.json'), JSON.stringify(updatedProducts, null, 2), 'utf8');
