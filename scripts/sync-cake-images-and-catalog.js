const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const productImagesBase = path.join(rootDir, 'public', 'PRODUCT_IMAGES', 'cakes');
const altImagesBase = path.join(rootDir, 'public', 'product-images', 'cakes');

// 1. Bento Cakes Mapping
const bentoCakes = [
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.31 PM.jpeg',
    newFile: 'classic-white-heart-bento-cake.jpeg',
    id: 'bento-classic-white-heart',
    name: 'Classic White Heart Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Adorable minimalist Korean white heart bento cake piped with delicate red micro-hearts and elegant Happy Birthday cursive calligraphy.',
    minPrice: 399,
    variants: [
      { weight: '350g Bento', price: 399, originalPrice: 450, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 499, originalPrice: 550, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 38,
    badge: 'Bento Favorite',
    code: 'LLP-BNT-001'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.31 PM (1).jpeg',
    newFile: 'ferrero-chocolate-drizzle-bento-cake.jpeg',
    id: 'bento-ferrero-chocolate-drizzle',
    name: 'Ferrero Chocolate Drizzle Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Rich chocolate fudge sponge loaded with Ferrero Rocher halves, glossy chocolate drizzle, and shimmering golden edible pearls.',
    minPrice: 450,
    variants: [
      { weight: '350g Bento', price: 450, originalPrice: 500, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 550, originalPrice: 620, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 42,
    badge: 'Best Seller',
    code: 'LLP-BNT-002'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.31 PM (2).jpeg',
    newFile: 'chocolate-hazelnut-crunch-bento-cake.jpeg',
    id: 'bento-chocolate-hazelnut-crunch',
    name: 'Chocolate Hazelnut Crunch Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Decadent dark chocolate sponge layered with creamy Nutella spread, toasted roasted nuts, and a golden Happy Birthday topper.',
    minPrice: 420,
    variants: [
      { weight: '350g Bento', price: 420, originalPrice: 480, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 520, originalPrice: 580, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 29,
    badge: 'Trending',
    code: 'LLP-BNT-003'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.32 PM (1).jpeg',
    newFile: 'lotus-biscoff-caramel-bento-cake.jpeg',
    id: 'bento-lotus-biscoff-caramel',
    name: 'Lotus Biscoff Caramel Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Smooth vanilla cream bento cake topped with rich Belgian Lotus Biscoff speculoos spread drip and a whole crunchy Biscoff biscuit.',
    minPrice: 440,
    variants: [
      { weight: '350g Bento', price: 440, originalPrice: 499, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 540, originalPrice: 600, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 35,
    badge: "Chef's Special",
    code: 'LLP-BNT-004'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.32 PM (2).jpeg',
    newFile: 'romantic-couple-love-bento-cake.jpeg',
    id: 'bento-romantic-couple-love',
    name: 'Romantic Couple Love Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Sweet love confession bento cake with cute hand-drawn couple illustration, red hearts, and surprise I Love U message ribbon.',
    minPrice: 430,
    variants: [
      { weight: '350g Bento', price: 430, originalPrice: 480, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 530, originalPrice: 590, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 46,
    badge: 'Romantic Pick',
    code: 'LLP-BNT-005'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.32 PM (3).jpeg',
    newFile: 'happy-birthday-my-love-bento-cake.jpeg',
    id: 'bento-happy-birthday-my-love',
    name: 'Happy Birthday My Love Couple Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Charming birthday bento cake featuring an adorable hugging couple illustration, red heart piping, and sparkling golden border.',
    minPrice: 420,
    variants: [
      { weight: '350g Bento', price: 420, originalPrice: 470, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 520, originalPrice: 580, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 31,
    badge: 'Couple Favorite',
    code: 'LLP-BNT-006'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.32 PM.jpeg',
    newFile: 'dark-chocolate-hazelnut-swirl-bento-cake.jpeg',
    id: 'bento-dark-chocolate-hazelnut-swirl',
    name: 'Dark Chocolate Hazelnut Swirl Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Silky chocolate truffle bento cake with an artisanal spiral swirl top, garnished with crunchy roasted hazelnuts and cocoa drizzle.',
    minPrice: 410,
    variants: [
      { weight: '350g Bento', price: 410, originalPrice: 460, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 510, originalPrice: 570, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 27,
    badge: 'Pure Chocolate',
    code: 'LLP-BNT-007'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.33 PM (1).jpeg',
    newFile: 'lavender-butterfly-floral-bento-cake.jpeg',
    id: 'bento-lavender-butterfly-floral',
    name: 'Lavender Butterfly Floral Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Pastel purple and blush pink square bento cake bordered with piped rosettes, gold sugar pearls, and delicate 3D flutter butterflies.',
    minPrice: 430,
    variants: [
      { weight: '350g Bento', price: 430, originalPrice: 490, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 530, originalPrice: 590, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 33,
    badge: 'Cute Aesthetic',
    code: 'LLP-BNT-008'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.33 PM (2).jpeg',
    newFile: 'roasted-nut-chocolate-praline-bento-cake.jpeg',
    id: 'bento-roasted-nut-chocolate-praline',
    name: 'Roasted Nut Chocolate Praline Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Moist chocolate cake layered with chocolate ganache piping, crunchy roasted praline nuts, and a mirror gold Happy Birthday disc.',
    minPrice: 420,
    variants: [
      { weight: '350g Bento', price: 420, originalPrice: 470, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 520, originalPrice: 580, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 24,
    badge: 'Nutty Delight',
    code: 'LLP-BNT-009'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.33 PM.jpeg',
    newFile: 'chocolate-strawberry-overload-bento-cake.jpeg',
    id: 'bento-chocolate-strawberry-overload',
    name: 'Chocolate Strawberry Overload Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Festive celebration bento loaded with farm-fresh strawberries, mini chocolate bar, Oreo biscuit, marshmallow, and roasted peanuts.',
    minPrice: 460,
    variants: [
      { weight: '350g Bento', price: 460, originalPrice: 520, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 560, originalPrice: 630, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 40,
    badge: 'Overload Special',
    code: 'LLP-BNT-010'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-09 at 7.45.34 PM.jpeg',
    newFile: 'pink-ombre-butterfly-birthday-bento-cake.jpeg',
    id: 'bento-pink-ombre-butterfly-birthday',
    name: 'Pink Ombre Butterfly Birthday Bento Cake',
    subCategory: 'Bento Cakes',
    category: 'bento-cake',
    categoryName: 'Bento Cakes',
    description: 'Dreamy pink and white ombre textured bento cake piped with Happy Birthday To Me lettering, sugar pearls, and golden-edged butterflies.',
    minPrice: 420,
    variants: [
      { weight: '350g Bento', price: 420, originalPrice: 480, offer: 'Free Candle & Spoon' },
      { weight: '500g Bento', price: 520, originalPrice: 580, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 36,
    badge: 'Pastel Dream',
    code: 'LLP-BNT-011'
  }
];

// 2. Wedding Cakes Mapping
const weddingCakes = [
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.29.42 PM.jpeg',
    newFile: 'cascading-orchid-blue-ombre-wedding-cake.jpeg',
    id: 'wedding-cascading-orchid-blue-ombre',
    name: 'Cascading Orchid Blue Ombre Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: 'Breathtaking 2-tier wedding cake in sky blue to ivory ombre with cascading yellow jasmine orchids, blush pink peonies, and silhouette Mr & Mrs topper.',
    minPrice: 2599,
    variants: [
      { weight: '2kg (2-Tier)', price: 2599, originalPrice: 2899, offer: 'Tier Cake Special' },
      { weight: '3kg (2-Tier)', price: 3599, originalPrice: 3999, offer: '' },
      { weight: '4kg (3-Tier)', price: 4699, originalPrice: 5199, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 48,
    badge: 'Signature 2-Tier',
    code: 'LLP-WED-001'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.39.39 PM (1).jpeg',
    newFile: 'royal-blush-crown-2tier-wedding-cake.jpeg',
    id: 'wedding-royal-blush-crown-2tier',
    name: 'Royal Blush Crown 2-Tier Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: 'Majestic blush pink horizontal textured 2-tier wedding cake crowned with a royal rhinestone tiara, custom monogram crest, champagne roses, and edible pearls.',
    minPrice: 2899,
    variants: [
      { weight: '2kg (2-Tier)', price: 2899, originalPrice: 3200, offer: 'Royal Monogram' },
      { weight: '3kg (2-Tier)', price: 3899, originalPrice: 4300, offer: '' },
      { weight: '4kg (3-Tier)', price: 4999, originalPrice: 5500, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 52,
    badge: 'Royal Masterpiece',
    code: 'LLP-WED-002'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.39.39 PM.jpeg',
    newFile: 'golden-drip-rose-2tier-wedding-cake.jpeg',
    id: 'wedding-golden-drip-rose-2tier',
    name: 'Golden Drip Rose 2-Tier Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: "Opulent 2-tier wedding cake featuring warm golden mango caramel drip, fresh scarlet red velvet roses, baby's breath, and gold Happy Married Life topper.",
    minPrice: 2699,
    variants: [
      { weight: '2kg (2-Tier)', price: 2699, originalPrice: 2999, offer: 'Fresh Floral Special' },
      { weight: '3kg (2-Tier)', price: 3699, originalPrice: 4099, offer: '' },
      { weight: '4kg (3-Tier)', price: 4799, originalPrice: 5299, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 45,
    badge: 'Grand Celebration',
    code: 'LLP-WED-003'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.49.14 PM.jpeg',
    newFile: 'pearl-pink-rose-elegance-wedding-cake.jpeg',
    id: 'wedding-pearl-pink-rose-elegance',
    name: 'Pearl & Pink Rose Elegance Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: "Timeless pure white artisanal wedding cake decorated with cascading pastel pink roses, abundant baby's breath blossoms, and scattered edible white pearls.",
    minPrice: 1999,
    variants: [
      { weight: '1.5kg Tall', price: 1999, originalPrice: 2299, offer: 'Fresh Floral' },
      { weight: '2kg (2-Tier)', price: 2499, originalPrice: 2799, offer: '' },
      { weight: '3kg (2-Tier)', price: 3499, originalPrice: 3899, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 39,
    badge: 'Classic Elegance',
    code: 'LLP-WED-004'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.49.15 PM.jpeg',
    newFile: 'peach-rose-silhouette-wedding-cake.jpeg',
    id: 'wedding-peach-rose-silhouette',
    name: 'Peach Rose Silhouette Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: "Chic modern wedding cake adorned with fresh peach garden roses, starry baby's breath, metallic gold pearls, and romantic bride & groom silhouette.",
    minPrice: 2199,
    variants: [
      { weight: '1.5kg Tall', price: 2199, originalPrice: 2499, offer: 'Silhouette Topper' },
      { weight: '2kg (2-Tier)', price: 2699, originalPrice: 2999, offer: '' },
      { weight: '3kg (2-Tier)', price: 3699, originalPrice: 4099, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 34,
    badge: 'Modern Romance',
    code: 'LLP-WED-005'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.50.34 PM (1).jpeg',
    newFile: 'crimson-romance-fondant-2tier-wedding-cake.jpeg',
    id: 'wedding-crimson-romance-fondant-2tier',
    name: 'Crimson Romance Fondant 2-Tier Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: 'Showstopping 2-tier wedding cake showcasing a romantic couple portrait with dramatic 3D crimson red fondant ruffle gown, velvety red roses, and gold trim.',
    minPrice: 3199,
    variants: [
      { weight: '2.5kg (2-Tier)', price: 3199, originalPrice: 3599, offer: 'Couture Ruffle Art' },
      { weight: '3.5kg (2-Tier)', price: 4299, originalPrice: 4799, offer: '' },
      { weight: '5kg (3-Tier)', price: 5899, originalPrice: 6499, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 56,
    badge: 'Couture Design',
    code: 'LLP-WED-006'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.50.34 PM (2).jpeg',
    newFile: 'lavender-romance-2tier-wedding-cake.jpeg',
    id: 'wedding-lavender-romance-2tier',
    name: 'Lavender Romance 2-Tier Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: 'Enchanting 2-tier wedding cake in soft lavender watercolor wash with glossy drip, silver leaf, fresh pink roses, and bride & groom portrait silhouette.',
    minPrice: 2799,
    variants: [
      { weight: '2kg (2-Tier)', price: 2799, originalPrice: 3099, offer: 'Stage Ready Special' },
      { weight: '3kg (2-Tier)', price: 3799, originalPrice: 4199, offer: '' },
      { weight: '4kg (3-Tier)', price: 4899, originalPrice: 5399, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 41,
    badge: 'Pastel Romance',
    code: 'LLP-WED-007'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.50.34 PM.jpeg',
    newFile: 'grand-floating-tier-luxury-wedding-cake.jpeg',
    id: 'wedding-grand-floating-tier-luxury',
    name: 'Grand Floating Tier Luxury Wedding Cake',
    subCategory: 'Wedding Cakes',
    category: 'wedding-cakes',
    categoryName: 'Wedding Cakes',
    description: 'Spectacular multi-tier showstopper featuring an illuminated acrylic floating spacer tier filled with gold and silver spheres, caramel drip, and fresh peach florals.',
    minPrice: 4499,
    variants: [
      { weight: '3.5kg (Floating Tier)', price: 4499, originalPrice: 4999, offer: 'Acrylic Spacer Included' },
      { weight: '5kg (3-Tier Floating)', price: 5999, originalPrice: 6699, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 60,
    badge: 'Luxury Floating Tier',
    code: 'LLP-WED-008'
  }
];

// 3. 1st Birthday Cakes Mapping (18 Items)
const birthdayCakes = [
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.44 PM (1).jpeg',
    newFile: 'purple-butterfly-fairy-princess-birthday-cake.jpeg',
    id: 'bday-purple-butterfly-fairy-princess',
    name: 'Purple Butterfly Fairy Princess 2-Tier Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Magical 2-tier lavender birthday cake with 3D purple butterflies, metallic balloons, golden number 1, and adorable fairy princess topper.',
    minPrice: 2299,
    variants: [
      { weight: '2kg (2-Tier)', price: 2299, originalPrice: 2599, offer: 'Topper Included' },
      { weight: '3kg (2-Tier)', price: 3299, originalPrice: 3699, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 44,
    badge: 'Fairy Theme',
    code: 'LLP-FBD-001'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.44 PM (2).jpeg',
    newFile: 'teddy-bear-toy-train-3tier-1st-birthday-cake.jpeg',
    id: 'bday-teddy-bear-toy-train-3tier',
    name: 'Teddy Bear Toy Train 3-Tier 1st Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Grand 3-tier baby blue milestone cake featuring handcrafted teddy bears, colorful toy train with cargo, fluffy fondant clouds, ladder, and golden crown number 1.',
    minPrice: 3499,
    variants: [
      { weight: '3kg (3-Tier)', price: 3499, originalPrice: 3899, offer: 'Full Toy Set' },
      { weight: '4kg (3-Tier)', price: 4499, originalPrice: 4999, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 57,
    badge: 'Grand 3-Tier',
    code: 'LLP-FBD-002'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.44 PM (3).jpeg',
    newFile: 'divine-peacock-vel-2tier-birthday-cake.jpeg',
    id: 'bday-divine-peacock-vel-2tier',
    name: 'Divine Peacock & Vel 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Traditional divine 2-tier milestone cake with sculpted peacock body and cascading emerald-gold tail feathers, golden Vel, and sacred Tamil alphabet lettering.',
    minPrice: 2699,
    variants: [
      { weight: '2kg (2-Tier)', price: 2699, originalPrice: 2999, offer: 'Traditional Special' },
      { weight: '3kg (2-Tier)', price: 3699, originalPrice: 4099, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 49,
    badge: 'Divine Traditional',
    code: 'LLP-FBD-003'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.44 PM.jpeg',
    newFile: 'royal-prince-crown-3tier-birthday-cake.jpeg',
    id: 'bday-royal-prince-crown-3tier',
    name: 'Royal Prince Crown 3-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Stately 3-tier royal blue and white striped birthday cake with baroque gold ornate crests, quilted pearl patterns, and a magnificent tall golden crown.',
    minPrice: 3399,
    variants: [
      { weight: '3kg (3-Tier)', price: 3399, originalPrice: 3799, offer: 'Royal Crown Included' },
      { weight: '4kg (3-Tier)', price: 4399, originalPrice: 4899, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 53,
    badge: 'Royal Prince',
    code: 'LLP-FBD-004'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.45 PM (1).jpeg',
    newFile: 'jungle-safari-adventure-2tier-birthday-cake.jpeg',
    id: 'bday-jungle-safari-adventure-2tier',
    name: 'Jungle Safari Adventure 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Exciting 2-tier jungle theme birthday cake featuring an edible safari jeep with elephant & lion, climbing monkey, giraffe, and zebra figures.',
    minPrice: 2599,
    variants: [
      { weight: '2kg (2-Tier)', price: 2599, originalPrice: 2899, offer: 'Complete Animal Set' },
      { weight: '3kg (2-Tier)', price: 3599, originalPrice: 3999, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 46,
    badge: 'Safari Adventure',
    code: 'LLP-FBD-005'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.46 PM (2).jpeg',
    newFile: 'baby-shark-underwater-floating-tier-birthday-cake.jpeg',
    id: 'bday-baby-shark-underwater-floating-tier',
    name: 'Baby Shark Underwater Floating Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Thrilling 3-tier Baby Shark celebration cake with clear LED-illuminated underwater spacer, edible octopus, scuba diver, and sandy ocean shore base.',
    minPrice: 3299,
    variants: [
      { weight: '3kg (Floating Tier)', price: 3299, originalPrice: 3699, offer: 'LED Spacer Included' },
      { weight: '4kg (Floating Tier)', price: 4299, originalPrice: 4799, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 61,
    badge: 'Underwater Shark',
    code: 'LLP-FBD-006'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.46 PM (3).jpeg',
    newFile: 'cocomelon-adventure-2tier-1st-birthday-cake.jpeg',
    id: 'bday-cocomelon-adventure-2tier',
    name: 'Cocomelon Adventure 2-Tier 1st Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Delightful 2-tier Cocomelon celebration cake with JJ figurine, yellow school bus, bright rainbow arch, watermelon TV, and personalized name blocks.',
    minPrice: 2599,
    variants: [
      { weight: '2kg (2-Tier)', price: 2599, originalPrice: 2899, offer: 'Cocomelon Figures' },
      { weight: '3kg (2-Tier)', price: 3599, originalPrice: 3999, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 55,
    badge: 'Kids Favorite',
    code: 'LLP-FBD-007'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.46 PM.jpeg',
    newFile: 'pastel-teddy-hot-air-balloon-birthday-cake.jpeg',
    id: 'bday-pastel-teddy-hot-air-balloon',
    name: 'Pastel Teddy Hot Air Balloon Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Dreamy pastel milestone cake with cute fondant teddy bear riding a colorful hot air balloon among fluffy white clouds and gold stars.',
    minPrice: 1899,
    variants: [
      { weight: '1.5kg Tall', price: 1899, originalPrice: 2199, offer: 'Smash Cake Friendly' },
      { weight: '2kg (2-Tier)', price: 2399, originalPrice: 2699, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 32,
    badge: 'Pastel Cute',
    code: 'LLP-FBD-008'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.47 PM (1).jpeg',
    newFile: 'safari-wild-one-lion-2tier-birthday-cake.jpeg',
    id: 'bday-safari-wild-one-lion-2tier',
    name: 'Safari Wild One Lion 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Vibrant 2-tier jungle cake in lush green gradients featuring a cheerful fondant lion cub, baby elephant, giraffe, zebra, and monstera leaves.',
    minPrice: 2599,
    variants: [
      { weight: '2kg (2-Tier)', price: 2599, originalPrice: 2899, offer: 'Wild One Special' },
      { weight: '3kg (2-Tier)', price: 3599, originalPrice: 3999, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 47,
    badge: 'Wild One Theme',
    code: 'LLP-FBD-009'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.47 PM (2).jpeg',
    newFile: 'rainbow-doll-kitten-2tier-1st-birthday-cake.jpeg',
    id: 'bday-rainbow-doll-kitten-2tier',
    name: 'Rainbow Doll & Kitten 2-Tier 1st Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Sweet 2-tier white and gold birthday cake with a seated doll in a rainbow ruffle dress, cute kitty cat, colorful fondant balloons, and number 1.',
    minPrice: 2499,
    variants: [
      { weight: '2kg (2-Tier)', price: 2499, originalPrice: 2799, offer: 'Handcrafted Dolls' },
      { weight: '3kg (2-Tier)', price: 3499, originalPrice: 3899, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 38,
    badge: 'Princess Doll',
    code: 'LLP-FBD-010'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.47 PM (3).jpeg',
    newFile: 'boss-baby-gentleman-2tier-1st-birthday-cake.jpeg',
    id: 'bday-boss-baby-gentleman-2tier',
    name: 'Boss Baby Gentleman 2-Tier 1st Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Stylish 2-tier Boss Baby celebration cake in baby blue and navy stripes with fondant necktie, suitcase, sunglasses, and golden number 1.',
    minPrice: 2499,
    variants: [
      { weight: '2kg (2-Tier)', price: 2499, originalPrice: 2799, offer: 'Theme Accents' },
      { weight: '3kg (2-Tier)', price: 3499, originalPrice: 3899, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 35,
    badge: 'Boss Baby',
    code: 'LLP-FBD-011'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.47 PM.jpeg',
    newFile: 'princess-castle-tiara-2tier-birthday-cake.jpeg',
    id: 'bday-princess-castle-tiara-2tier',
    name: 'Princess Castle Tiara 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Fairytale 2-tier pink and ivory princess cake with royal golden tiara, embossed castle walls, sugar blossoms, and gold bunting.',
    minPrice: 2699,
    variants: [
      { weight: '2kg (2-Tier)', price: 2699, originalPrice: 2999, offer: 'Golden Tiara' },
      { weight: '3kg (2-Tier)', price: 3699, originalPrice: 4099, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 42,
    badge: 'Princess Royal',
    code: 'LLP-FBD-012'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.48 PM (1).jpeg',
    newFile: 'twinkle-twinkle-little-star-1st-birthday-cake.jpeg',
    id: 'bday-twinkle-twinkle-little-star',
    name: 'Twinkle Little Star Clouds 1st Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Gentle baby celebration cake with sleeping crescent moon, soft pastel clouds, shimmering gold stars, and milestone number 1.',
    minPrice: 1799,
    variants: [
      { weight: '1.5kg', price: 1799, originalPrice: 2099, offer: 'Low Sugar Friendly' },
      { weight: '2kg', price: 2299, originalPrice: 2599, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 28,
    badge: 'Smash Cake',
    code: 'LLP-FBD-013'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.49 PM (1).jpeg',
    newFile: 'golden-elephant-balloon-2tier-birthday-cake.jpeg',
    id: 'bday-golden-elephant-balloon-2tier',
    name: 'Golden Elephant Balloon 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Adorable 2-tier milestone cake with sculpted baby elephant holding golden balloons, soft white clouds, and golden star accents.',
    minPrice: 2399,
    variants: [
      { weight: '2kg (2-Tier)', price: 2399, originalPrice: 2699, offer: 'Elephant Topper' },
      { weight: '3kg (2-Tier)', price: 3399, originalPrice: 3799, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 39,
    badge: 'Cute Animal',
    code: 'LLP-FBD-014'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.49 PM (2).jpeg',
    newFile: 'enchanted-butterfly-led-floating-tier-cake.jpeg',
    id: 'bday-enchanted-butterfly-led-floating-tier',
    name: 'Enchanted Butterfly LED Floating Tier Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Breathtaking 2-tier purple fairy celebration cake with illuminated LED transparent cylinder spacer, gold balloons, and flying butterflies.',
    minPrice: 3399,
    variants: [
      { weight: '3kg (Floating Tier)', price: 3399, originalPrice: 3799, offer: 'LED Spacer Included' },
      { weight: '4kg (Floating Tier)', price: 4399, originalPrice: 4899, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 50,
    badge: 'LED Floating Tier',
    code: 'LLP-FBD-015'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.14.49 PM.jpeg',
    newFile: 'birthday-queen-illuminated-floating-tier-cake.jpeg',
    id: 'bday-birthday-queen-illuminated-floating-tier',
    name: 'Birthday Queen Illuminated Floating Tier Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Opulent blush celebration cake with clear illuminated spacer tier filled with fairy lights, golden crown, chocolate bars, and gold fan.',
    minPrice: 3299,
    variants: [
      { weight: '3kg (Floating Tier)', price: 3299, originalPrice: 3699, offer: 'Fairy Lights Included' },
      { weight: '4kg (Floating Tier)', price: 4299, originalPrice: 4799, offer: '' }
    ],
    rating: 5.0,
    reviewCount: 48,
    badge: 'Birthday Queen',
    code: 'LLP-FBD-016'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.17.19 PM (1).jpeg',
    newFile: 'peppa-pig-sunny-garden-2tier-birthday-cake.jpeg',
    id: 'bday-peppa-pig-sunny-garden-2tier',
    name: 'Peppa Pig Sunny Garden 2-Tier Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Joyful 2-tier kids cake with handcrafted Peppa Pig and George figures playing in a sunny green garden with rainbow and sunshine.',
    minPrice: 2499,
    variants: [
      { weight: '2kg (2-Tier)', price: 2499, originalPrice: 2799, offer: 'Peppa & George Figures' },
      { weight: '3kg (2-Tier)', price: 3499, originalPrice: 3899, offer: '' }
    ],
    rating: 4.8,
    reviewCount: 37,
    badge: 'Kids Delight',
    code: 'LLP-FBD-017'
  },
  {
    oldFile: 'WhatsApp Image 2026-10-07 at 9.21.44 PM (1).jpeg',
    newFile: 'cute-dino-jurassic-adventure-birthday-cake.jpeg',
    id: 'bday-cute-dino-jurassic-adventure',
    name: 'Cute Dino Jurassic Adventure Birthday Cake',
    subCategory: '1st Birthday Cakes',
    category: 'first-birthday',
    categoryName: '1st Birthday Cakes',
    description: 'Playful pastel dinosaur birthday cake with baby T-Rex and Triceratops figures, green fondant foliage, volcanic rocks, and milestone number 1.',
    minPrice: 2199,
    variants: [
      { weight: '1.5kg', price: 2199, originalPrice: 2499, offer: 'Dino Figurines' },
      { weight: '2kg (2-Tier)', price: 2699, originalPrice: 2999, offer: '' }
    ],
    rating: 4.9,
    reviewCount: 31,
    badge: 'Dino Adventure',
    code: 'LLP-FBD-018'
  }
];

function processSection(items, folderName) {
  const dirPath = path.join(productImagesBase, folderName);
  const altDirPath = path.join(altImagesBase, folderName);
  if (!fs.existsSync(altDirPath)) {
    fs.mkdirSync(altDirPath, { recursive: true });
  }

  const processed = [];

  for (const item of items) {
    const oldPath = path.join(dirPath, item.oldFile);
    const newPath = path.join(dirPath, item.newFile);
    const altNewPath = path.join(altDirPath, item.newFile);

    // If new file doesn't exist but old file does, rename it
    if (!fs.existsSync(newPath) && fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${item.oldFile} -> ${item.newFile}`);
    } else if (fs.existsSync(newPath)) {
      console.log(`Already renamed: ${item.newFile}`);
    } else {
      console.warn(`File not found: ${oldPath} or ${newPath}`);
    }

    // Mirror to alt path
    if (fs.existsSync(newPath)) {
      fs.copyFileSync(newPath, altNewPath);
    }

    // URL path that matches Next.js public directory
    const imageUri = `/PRODUCT_IMAGES/cakes/${folderName}/${item.newFile}`;

    processed.push({
      id: item.id,
      name: item.name,
      baseName: item.name,
      category: item.category,
      subCategory: item.subCategory,
      categoryName: item.categoryName,
      image: imageUri,
      rating: item.rating,
      reviewCount: item.reviewCount,
      badge: item.badge,
      description: item.description,
      minPrice: item.minPrice,
      variants: item.variants,
      ingredients: [
        '🌱 100% Freshly Baked',
        'Custom Lettering & Toppers Included',
        'Delivered Fresh Across Coimbatore'
      ],
      egglessAvailable: true,
      productCode: item.code
    });
  }

  return processed;
}

const bentoProducts = processSection(bentoCakes, 'BENTO CAKES');
const weddingProducts = processSection(weddingCakes, 'WEDDING CAKES');
const bdayProducts = processSection(birthdayCakes, '1ST BIRTHDAY CAKES');

console.log(`Processed: ${bentoProducts.length} Bento, ${weddingProducts.length} Wedding, ${bdayProducts.length} Birthday`);

// Update products-data.json
const dataJsonPath = path.join(rootDir, 'lib', 'products-data.json');
let existingCatalog = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));

// Remove old ones if already present
const newIds = new Set([...bentoProducts, ...weddingProducts, ...bdayProducts].map(p => p.id));
existingCatalog = existingCatalog.filter(p => !newIds.has(p.id));

// Append new products
const updatedCatalog = [...existingCatalog, ...bentoProducts, ...weddingProducts, ...bdayProducts];
fs.writeFileSync(dataJsonPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');
console.log(`✅ products-data.json updated! Total items: ${updatedCatalog.length}`);
