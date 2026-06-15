// Rich sample chef + menu data for the Potluck marketing site.
// Shared by the Explore listing and individual chef pages. Menu `id`s are
// stable and used as the like-counter key (see app/api/menus/like/route.ts).

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number; // cents (SGD)
  image: string;
  isVegetarian: boolean;
  prepTime: number; // minutes
};

export type Chef = {
  id: string; // slug
  name: string;
  specialty: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  priceRange: string;
  minPrice: number;
  bio: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
  menus: MenuItem[];
};

const PORTRAIT = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;
const DISH = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;

export const CHEFS: Chef[] = [
  {
    id: 'sarah-tan',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    cuisines: ['Peranakan', 'Chinese'],
    rating: 4.9,
    reviewCount: 127,
    location: 'Tiong Bahru',
    image: PORTRAIT('photo-1577219491135-ce391730fb2c'),
    priceRange: '$40-60',
    minPrice: 40,
    bio: 'A third-generation Nyonya cook, Sarah learned to pound rempah from her grandmother in Katong. Her table celebrates the slow, layered flavours of Peranakan home cooking.',
    socialMedia: { instagram: 'chefsarahtan', facebook: 'chefsarahtan', tiktok: 'chefsarahtan' },
    menus: [
      { id: 'sarah-tan-1', name: 'Ayam Buah Keluak', description: 'Traditional Peranakan chicken stew with black nuts — a signature Nyonya dish that takes hours to prepare.', price: 4500, image: DISH('photo-1567620905732-2d1ec7ab7445'), isVegetarian: false, prepTime: 120 },
      { id: 'sarah-tan-2', name: 'Laksa Lemak', description: 'Rich, creamy coconut curry noodle soup with prawns, fish cake and all the traditional toppings.', price: 3500, image: DISH('photo-1569718212165-3a8278d5f624'), isVegetarian: false, prepTime: 60 },
    ],
  },
  {
    id: 'ahmad-rahman',
    name: 'Chef Ahmad Rahman',
    specialty: 'Malay',
    cuisines: ['Malay', 'Halal'],
    rating: 4.8,
    reviewCount: 89,
    location: 'Geylang Serai',
    image: PORTRAIT('photo-1556909114-f6e7ad7d3136'),
    priceRange: '$35-50',
    minPrice: 35,
    bio: 'Ahmad brings the warmth of kampung cooking to the city, with recipes passed down through four generations of his family in Geylang Serai.',
    socialMedia: { instagram: 'chefahmad', facebook: 'chefahmadrahman' },
    menus: [
      { id: 'ahmad-rahman-1', name: 'Nasi Ambeng Set', description: 'Traditional Javanese rice platter with beef rendang, sambal goreng, bergedel and more.', price: 4000, image: DISH('photo-1563379091339-03b21ab4a4f8'), isVegetarian: false, prepTime: 90 },
      { id: 'ahmad-rahman-2', name: 'Mee Rebus', description: 'Yellow noodles in thick, spicy gravy topped with egg, tofu, lime and crispy shallots.', price: 2800, image: DISH('photo-1585032226651-759b368d7246'), isVegetarian: false, prepTime: 45 },
    ],
  },
  {
    id: 'maria-santos',
    name: 'Chef Maria Santos',
    specialty: 'Filipino',
    cuisines: ['Filipino', 'Western'],
    rating: 4.7,
    reviewCount: 64,
    location: 'Toa Payoh',
    image: PORTRAIT('photo-1581349485608-9469926a8e5e'),
    priceRange: '$30-45',
    minPrice: 30,
    bio: 'Maria cooks the comforting, festive food of her hometown in Pampanga — generous, soulful and made for sharing.',
    socialMedia: { instagram: 'chefmariasantos', tiktok: 'chefmaria' },
    menus: [
      { id: 'maria-santos-1', name: 'Lechon Kawali', description: 'Crispy deep-fried pork belly served with homemade liver sauce.', price: 3800, image: DISH('photo-1544025162-d76694265947'), isVegetarian: false, prepTime: 75 },
      { id: 'maria-santos-2', name: 'Kare-Kare', description: 'Rich oxtail stew in peanut sauce with vegetables and shrimp paste on the side.', price: 4200, image: DISH('photo-1547592166-23ac45744acd'), isVegetarian: false, prepTime: 120 },
    ],
  },
  {
    id: 'kenji-yamamoto',
    name: 'Chef Kenji Yamamoto',
    specialty: 'Japanese',
    cuisines: ['Japanese'],
    rating: 4.9,
    reviewCount: 156,
    location: 'Robertson Quay',
    image: PORTRAIT('photo-1512485694743-9c9538b4e6e0'),
    priceRange: '$60-120',
    minPrice: 60,
    bio: 'Trained in Tokyo and Osaka, Kenji serves an intimate omakase at home, sourcing seasonal fish flown in twice weekly.',
    socialMedia: { instagram: 'chefkenji', website: 'kenji-omakase.sg' },
    menus: [
      { id: 'kenji-yamamoto-1', name: 'Omakase Set (8 Course)', description: "Chef's selection of seasonal sashimi, nigiri and specialty dishes.", price: 12000, image: DISH('photo-1579871494447-9811cf80d66c'), isVegetarian: false, prepTime: 90 },
      { id: 'kenji-yamamoto-2', name: 'Chirashi Don', description: 'Assorted premium sashimi over seasoned sushi rice.', price: 6500, image: DISH('photo-1534482421-64566f976cfa'), isVegetarian: false, prepTime: 30 },
    ],
  },
  {
    id: 'priya-sharma',
    name: 'Chef Priya Sharma',
    specialty: 'North Indian',
    cuisines: ['Indian', 'Vegetarian'],
    rating: 4.8,
    reviewCount: 103,
    location: 'Little India',
    image: PORTRAIT('photo-1607631568010-a87245c0daf8'),
    priceRange: '$35-55',
    minPrice: 35,
    bio: 'Priya specialises in the rich, aromatic curries of Punjab, grinding her own masalas fresh for every booking.',
    socialMedia: { instagram: 'chefpriyasharma', facebook: 'priyaskitchen' },
    menus: [
      { id: 'priya-sharma-1', name: 'Thali Set (Vegetarian)', description: 'Complete meal with dal, sabzi, rice, roti, raita and dessert.', price: 3500, image: DISH('photo-1585937421612-70a008356fbe'), isVegetarian: true, prepTime: 60 },
      { id: 'priya-sharma-2', name: 'Paneer Tikka Masala', description: 'Marinated cottage cheese in a rich tomato-cream curry, served with naan.', price: 2800, image: DISH('photo-1565557623262-b51c2513a641'), isVegetarian: true, prepTime: 45 },
    ],
  },
  {
    id: 'kim-soo-young',
    name: 'Chef Kim Soo-young',
    specialty: 'Korean',
    cuisines: ['Korean'],
    rating: 4.7,
    reviewCount: 78,
    location: 'Tanjong Pagar',
    image: PORTRAIT('photo-1600565193348-f74bd3c7ccdf'),
    priceRange: '$45-65',
    minPrice: 45,
    bio: 'Soo-young ferments her own kimchi and gochujang, bringing authentic Seoul home-cooking to your table.',
    socialMedia: { instagram: 'chefkimsy', tiktok: 'kimsykitchen' },
    menus: [
      { id: 'kim-soo-young-1', name: 'Korean BBQ Set', description: 'Marinated galbi and samgyeopsal with banchan, ssam and dipping sauces.', price: 5500, image: DISH('photo-1632558331135-c8e2c2c6c2c2'), isVegetarian: false, prepTime: 50 },
      { id: 'kim-soo-young-2', name: 'Bibimbap', description: 'Warm rice bowl with seasoned vegetables, beef, egg and gochujang.', price: 2600, image: DISH('photo-1553163147-622ab57be1c7'), isVegetarian: false, prepTime: 35 },
    ],
  },
  {
    id: 'mei-lin-wong',
    name: 'Chef Mei Lin Wong',
    specialty: 'Cantonese',
    cuisines: ['Chinese', 'Cantonese'],
    rating: 4.8,
    reviewCount: 142,
    location: 'Chinatown',
    image: PORTRAIT('photo-1595257841889-eca2678454e2'),
    priceRange: '$40-70',
    minPrice: 40,
    bio: 'Mei Lin honours classic Cantonese technique — clean flavours, perfect wok hei and dishes steamed to order.',
    socialMedia: { instagram: 'meilinkitchen', facebook: 'meilinwong' },
    menus: [
      { id: 'mei-lin-wong-1', name: 'Steamed Soy Garlic Fish', description: 'Whole sea bass steamed with ginger, spring onion and house soy.', price: 4800, image: DISH('photo-1580476262798-bddd9f4b7369'), isVegetarian: false, prepTime: 40 },
      { id: 'mei-lin-wong-2', name: 'Claypot Rice', description: 'Smoky claypot rice with lap cheong, chicken and salted fish.', price: 3000, image: DISH('photo-1516684732162-798a0062be99'), isVegetarian: false, prepTime: 55 },
    ],
  },
  {
    id: 'raj-kumar',
    name: 'Chef Raj Kumar',
    specialty: 'South Indian',
    cuisines: ['Indian', 'South Indian'],
    rating: 4.6,
    reviewCount: 71,
    location: 'Serangoon',
    image: PORTRAIT('photo-1583394293214-28a5b42a8c0f'),
    priceRange: '$25-40',
    minPrice: 25,
    bio: 'Raj makes feather-light dosai and fiery Chettinad curries the way his amma taught him in Madurai.',
    socialMedia: { instagram: 'rajdosacorner' },
    menus: [
      { id: 'raj-kumar-1', name: 'Masala Dosai Set', description: 'Crispy dosai with spiced potato, sambar and three chutneys.', price: 2200, image: DISH('photo-1668236543090-82eba5ee5976'), isVegetarian: true, prepTime: 40 },
      { id: 'raj-kumar-2', name: 'Chettinad Chicken', description: 'Bold, peppery South Indian chicken curry with appam.', price: 3200, image: DISH('photo-1631452180519-c014fe946bc7'), isVegetarian: false, prepTime: 60 },
    ],
  },
  {
    id: 'siti-nurhaliza',
    name: 'Chef Siti Nurhaliza',
    specialty: 'Indonesian',
    cuisines: ['Indonesian', 'Halal'],
    rating: 4.7,
    reviewCount: 95,
    location: 'Bedok',
    image: PORTRAIT('photo-1438761681033-6461ffad8d80'),
    priceRange: '$30-45',
    minPrice: 30,
    bio: 'Siti recreates the smoky, sambal-rich flavours of Padang and Java, with everything cooked from scratch.',
    socialMedia: { instagram: 'sitikitchensg', tiktok: 'sitikitchen' },
    menus: [
      { id: 'siti-nurhaliza-1', name: 'Beef Rendang', description: 'Slow-cooked beef in coconut and spices until deeply caramelised, with nasi lemak.', price: 3600, image: DISH('photo-1606491956689-2ea866880c84'), isVegetarian: false, prepTime: 150 },
      { id: 'siti-nurhaliza-2', name: 'Gado-Gado', description: 'Blanched vegetables, tofu and egg with a rich peanut sauce.', price: 2000, image: DISH('photo-1512621776951-a57141f2eefd'), isVegetarian: true, prepTime: 30 },
    ],
  },
  {
    id: 'lucas-oliveira',
    name: 'Chef Lucas Oliveira',
    specialty: 'Brazilian',
    cuisines: ['Western', 'Brazilian'],
    rating: 4.6,
    reviewCount: 58,
    location: 'Holland Village',
    image: PORTRAIT('photo-1492562080023-ab3db95bfbce'),
    priceRange: '$45-75',
    minPrice: 45,
    bio: 'Lucas hosts a churrasco-style feast — fire, smoke and generous cuts, São Paulo style.',
    socialMedia: { instagram: 'lucaschurrasco', website: 'lucasgrill.sg' },
    menus: [
      { id: 'lucas-oliveira-1', name: 'Picanha Churrasco', description: 'Grilled picanha sliced at the table with farofa, vinaigrette and rice.', price: 5800, image: DISH('photo-1558030006-450675393462'), isVegetarian: false, prepTime: 70 },
    ],
  },
  {
    id: 'aisha-begum',
    name: 'Chef Aisha Begum',
    specialty: 'Bengali',
    cuisines: ['Indian', 'Bengali', 'Halal'],
    rating: 4.8,
    reviewCount: 66,
    location: 'Geylang',
    image: PORTRAIT('photo-1531123897727-8f129e1688ce'),
    priceRange: '$30-50',
    minPrice: 30,
    bio: 'Aisha specialises in the delicate fish curries and biryanis of Dhaka, cooked low and slow.',
    socialMedia: { instagram: 'aishaskitchensg', facebook: 'aishabegum' },
    menus: [
      { id: 'aisha-begum-1', name: 'Kacchi Biryani', description: 'Fragrant layered mutton biryani slow-cooked in sealed pot, served with borhani.', price: 4200, image: DISH('photo-1563379091339-03b21ab4a4f8'), isVegetarian: false, prepTime: 120 },
    ],
  },
  {
    id: 'chen-wei',
    name: 'Chef Chen Wei',
    specialty: 'Sichuan',
    cuisines: ['Chinese', 'Sichuan'],
    rating: 4.7,
    reviewCount: 110,
    location: 'Jurong East',
    image: PORTRAIT('photo-1607990281513-2c110a25bd8c'),
    priceRange: '$35-55',
    minPrice: 35,
    bio: 'Chen Wei brings the numbing heat of Chengdu home — mala done with balance, not just fire.',
    socialMedia: { instagram: 'chenweimala', tiktok: 'malachef' },
    menus: [
      { id: 'chen-wei-1', name: 'Mapo Tofu', description: 'Silken tofu in a fiery, numbing minced-pork sauce with Sichuan peppercorns.', price: 2400, image: DISH('photo-1582576163090-09d3b6f1d2c0'), isVegetarian: false, prepTime: 35 },
      { id: 'chen-wei-2', name: 'Boiled Fish in Chilli Oil', description: 'Tender fish slices poached in a cauldron of chilli and Sichuan pepper.', price: 4600, image: DISH('photo-1455619452474-d2be8b1e70cd'), isVegetarian: false, prepTime: 50 },
    ],
  },
  {
    id: 'nguyen-thi-lan',
    name: 'Chef Nguyen Thi Lan',
    specialty: 'Vietnamese',
    cuisines: ['Vietnamese'],
    rating: 4.8,
    reviewCount: 87,
    location: 'Joo Chiat',
    image: PORTRAIT('photo-1544723795-3fb6469f5b39'),
    priceRange: '$28-45',
    minPrice: 28,
    bio: 'Lan simmers her pho broth for 12 hours and rolls every spring roll by hand — fresh, herby and light.',
    socialMedia: { instagram: 'lanphokitchen', facebook: 'lanvietnamese' },
    menus: [
      { id: 'nguyen-thi-lan-1', name: 'Pho Bo', description: '12-hour beef broth with rice noodles, brisket and a basket of fresh herbs.', price: 2400, image: DISH('photo-1582878826629-29b7ad1cdc43'), isVegetarian: false, prepTime: 40 },
      { id: 'nguyen-thi-lan-2', name: 'Fresh Spring Rolls', description: 'Hand-rolled goi cuon with prawn, herbs and peanut hoisin dip.', price: 1600, image: DISH('photo-1553611042-d1d2e6c7f0bf'), isVegetarian: false, prepTime: 25 },
    ],
  },
  {
    id: 'grace-tan',
    name: 'Chef Grace Tan',
    specialty: 'Patisserie',
    cuisines: ['Desserts', 'Western'],
    rating: 4.9,
    reviewCount: 134,
    location: 'Katong',
    image: PORTRAIT('photo-1607746882042-944635dfe10e'),
    priceRange: '$20-40',
    minPrice: 20,
    bio: 'A former hotel pastry chef, Grace bakes small-batch cakes and local kueh with French precision.',
    socialMedia: { instagram: 'gracebakes', tiktok: 'gracebakes', website: 'gracebakes.sg' },
    menus: [
      { id: 'grace-tan-1', name: 'Pandan Gula Melaka Cake', description: 'Featherlight pandan chiffon layered with gula melaka cream.', price: 3800, image: DISH('photo-1578985545062-69928b1d9587'), isVegetarian: true, prepTime: 90 },
      { id: 'grace-tan-2', name: 'Nyonya Kueh Platter', description: 'Assorted handmade kueh — kueh salat, ondeh ondeh and kueh lapis.', price: 2400, image: DISH('photo-1519869325930-281384150729'), isVegetarian: true, prepTime: 60 },
    ],
  },
  {
    id: 'hassan-ali',
    name: 'Chef Hassan Ali',
    specialty: 'Middle Eastern',
    cuisines: ['Middle Eastern', 'Halal'],
    rating: 4.7,
    reviewCount: 72,
    location: 'Bugis',
    image: PORTRAIT('photo-1568602471122-7832951cc4c5'),
    priceRange: '$35-55',
    minPrice: 35,
    bio: 'Hassan cooks the mezze and charcoal grills of Beirut, with bread baked fresh on the spot.',
    socialMedia: { instagram: 'hassanmezze', facebook: 'hassanali' },
    menus: [
      { id: 'hassan-ali-1', name: 'Mixed Grill Mezze', description: 'Lamb kofta, shish taouk, hummus, tabbouleh and warm pita.', price: 4800, image: DISH('photo-1529006557810-274b9b2fc783'), isVegetarian: false, prepTime: 60 },
    ],
  },
  {
    id: 'yuki-tanaka',
    name: 'Chef Yuki Tanaka',
    specialty: 'Ramen',
    cuisines: ['Japanese'],
    rating: 4.8,
    reviewCount: 119,
    location: 'Orchard',
    image: PORTRAIT('photo-1573496359142-b8d87734a5a2'),
    priceRange: '$25-45',
    minPrice: 25,
    bio: 'Yuki obsesses over tonkotsu — a 20-hour pork broth, house tare and noodles to match.',
    socialMedia: { instagram: 'yukiramen', tiktok: 'yukiramen' },
    menus: [
      { id: 'yuki-tanaka-1', name: 'Tonkotsu Ramen', description: '20-hour pork broth with chashu, ajitama egg and house noodles.', price: 2600, image: DISH('photo-1557872943-16a5ac26437e'), isVegetarian: false, prepTime: 30 },
      { id: 'yuki-tanaka-2', name: 'Matcha Tiramisu', description: 'Silky mascarpone layered with stone-ground matcha sponge.', price: 1400, image: DISH('photo-1515823662972-da6a2e4d3002'), isVegetarian: true, prepTime: 45 },
    ],
  },
  {
    id: 'devi-lakshmi',
    name: 'Chef Devi Lakshmi',
    specialty: 'Vegetarian Indian',
    cuisines: ['Indian', 'Vegetarian', 'Vegan'],
    rating: 4.9,
    reviewCount: 88,
    location: 'Tekka',
    image: PORTRAIT('photo-1551434678-e076c223a692'),
    priceRange: '$22-38',
    minPrice: 22,
    bio: 'Devi proves vegetarian food is never boring — vibrant sabzis, fresh chutneys and zero shortcuts.',
    socialMedia: { instagram: 'deviveg', facebook: 'devilakshmi' },
    menus: [
      { id: 'devi-lakshmi-1', name: 'Vegan Thali', description: 'Seasonal sabzi, dal tadka, jeera rice, roti and pickle — fully plant-based.', price: 2800, image: DISH('photo-1546833999-b9f581a1996d'), isVegetarian: true, prepTime: 55 },
    ],
  },
  {
    id: 'marco-rossi',
    name: 'Chef Marco Rossi',
    specialty: 'Italian',
    cuisines: ['Western', 'Italian'],
    rating: 4.8,
    reviewCount: 124,
    location: 'Dempsey',
    image: PORTRAIT('photo-1583394838336-acd977736f90'),
    priceRange: '$50-85',
    minPrice: 50,
    bio: 'Marco rolls pasta by hand every morning, cooking the rustic food of his native Bologna.',
    socialMedia: { instagram: 'marcopasta', website: 'marcorossi.sg' },
    menus: [
      { id: 'marco-rossi-1', name: 'Tagliatelle al Ragù', description: 'Hand-cut tagliatelle with a slow-simmered Bolognese ragù.', price: 3600, image: DISH('photo-1621996346565-e3dbc646d9a9'), isVegetarian: false, prepTime: 50 },
      { id: 'marco-rossi-2', name: 'Margherita Pizza', description: 'Wood-fired sourdough base, San Marzano tomato, buffalo mozzarella and basil.', price: 3000, image: DISH('photo-1574071318508-1cdbab80d002'), isVegetarian: true, prepTime: 25 },
    ],
  },
  {
    id: 'fatimah-yusof',
    name: 'Chef Fatimah Yusof',
    specialty: 'Nyonya Halal',
    cuisines: ['Peranakan', 'Halal'],
    rating: 4.7,
    reviewCount: 69,
    location: 'Pasir Ris',
    image: PORTRAIT('photo-1559941836-04d5b1a3f2d8'),
    priceRange: '$35-55',
    minPrice: 35,
    bio: 'Fatimah cooks halal-certified Nyonya classics, balancing tradition with the needs of every guest.',
    socialMedia: { instagram: 'fatimahnyonya', facebook: 'fatimahyusof' },
    menus: [
      { id: 'fatimah-yusof-1', name: 'Itik Tim', description: 'Comforting salted vegetable and duck soup, slow-simmered.', price: 3400, image: DISH('photo-1547928576-b822bc410bdf'), isVegetarian: false, prepTime: 90 },
    ],
  },
  {
    id: 'daniel-lim',
    name: 'Chef Daniel Lim',
    specialty: 'Hainanese',
    cuisines: ['Chinese', 'Local'],
    rating: 4.8,
    reviewCount: 151,
    location: 'Ang Mo Kio',
    image: PORTRAIT('photo-1566554273541-37a9ca77b91f'),
    priceRange: '$25-45',
    minPrice: 25,
    bio: 'Daniel is a third-generation Hainanese cook serving the chicken rice and pork chop his grandfather sold on Purvis Street.',
    socialMedia: { instagram: 'daniellimkitchen', tiktok: 'danielchickenrice' },
    menus: [
      { id: 'daniel-lim-1', name: 'Hainanese Chicken Rice', description: 'Poached chicken, fragrant rice, chilli, ginger and dark soy.', price: 1800, image: DISH('photo-1617093727343-374698b1b08d'), isVegetarian: false, prepTime: 60 },
      { id: 'daniel-lim-2', name: 'Hainanese Pork Chop', description: 'Crispy pork chop in a tangy tomato and pea gravy, the old Hainanese way.', price: 2400, image: DISH('photo-1604908176997-125f25cc6f3d'), isVegetarian: false, prepTime: 45 },
    ],
  },
];

export function getChef(id: string): Chef | undefined {
  return CHEFS.find((c) => c.id === id);
}

export function getAllMenuIds(): string[] {
  return CHEFS.flatMap((c) => c.menus.map((m) => m.id));
}

export const TOTAL_MENU_ITEMS = getAllMenuIds().length;
