/**
 * Seeds blog categories + posts. Idempotent UPSERT: re-running syncs every post's
 * content/tags/SEO to the latest (existing rows are updated, not skipped), while
 * preserving live like/view counts. Run it on each environment to keep them identical.
 * Run: pnpm --filter @homechef/web seed:blog
 */
import { sql } from 'drizzle-orm';
import { db } from '../lib/db';
import { blogCategories, blogPosts } from '../lib/schema';
import { slugify, estimateReadingTime } from '../lib/slug';

// ---------------------------------------------------------------------------
// Ensure tables exist (so seeding works without the API's drizzle-kit push).
// ---------------------------------------------------------------------------
async function ensureSchema() {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
  await db.execute(sql`DO $$ BEGIN
    CREATE TYPE blog_status AS ENUM ('draft','published');
  EXCEPTION WHEN duplicate_object THEN null; END $$;`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS blog_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL,
    slug varchar(120) UNIQUE NOT NULL,
    description text,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(250) NOT NULL,
    slug varchar(250) UNIQUE NOT NULL,
    excerpt text,
    content_html text,
    featured_image text,
    category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
    author_name varchar(120) NOT NULL DEFAULT 'Potluck Team',
    status blog_status NOT NULL DEFAULT 'draft',
    featured boolean NOT NULL DEFAULT false,
    reading_time integer NOT NULL DEFAULT 3,
    view_count integer NOT NULL DEFAULT 0,
    like_count integer NOT NULL DEFAULT 0,
    seo_title varchar(250),
    seo_description text,
    seo_keywords text,
    tags text[],
    published_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`);
  // Idempotent migration for existing DBs that predate the tags column.
  await db.execute(sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags text[]`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS menu_likes (
    menu_id varchar(120) PRIMARY KEY,
    like_count integer NOT NULL DEFAULT 0,
    updated_at timestamp NOT NULL DEFAULT now()
  )`);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
const CATEGORIES: { name: string; description: string }[] = [
  { name: 'Peranakan', description: 'Nyonya heritage cooking and its layered flavours.' },
  { name: 'Malay', description: 'Kampung classics, sambals and slow-cooked favourites.' },
  { name: 'Chinese', description: 'From Cantonese to Sichuan, the breadth of Chinese home cooking.' },
  { name: 'Indian', description: 'Curries, breads and spice from across the subcontinent.' },
  { name: 'Japanese', description: 'Sushi, ramen and the art of Japanese home dining.' },
  { name: 'Korean', description: 'Fermentation, banchan and Korean comfort food.' },
  { name: 'Western', description: 'European and modern Western dishes for the home table.' },
  { name: 'Vegetarian', description: 'Plant-forward meals that never feel like a compromise.' },
  { name: 'Desserts', description: 'Kueh, cakes and sweet endings.' },
  { name: 'Halal', description: 'Halal-certified home dining across cuisines.' },
  { name: 'Home Dining Tips', description: 'How to host and enjoy a great home dining experience.' },
  { name: 'Chef Stories', description: 'Meet the home chefs behind the meals.' },
  { name: 'Food Culture', description: "Singapore's food heritage and the stories on our plates." },
  { name: 'Healthy Eating', description: 'Balanced, nourishing meals made at home.' },
  { name: 'Meal Prep', description: 'Plan, batch and cook smarter through the week.' },
  { name: 'Festive Cooking', description: 'Reunion dinners, Hari Raya, Deepavali and more.' },
  { name: 'Singapore Hawker', description: 'Hawker favourites recreated at home.' },
  { name: 'Sustainability', description: 'Low-waste, seasonal and conscious cooking.' },
  { name: 'Behind the Kitchen', description: 'A peek into how home chefs work.' },
  { name: 'Recipes', description: 'Step-by-step recipes from our community.' },
  { name: 'Events', description: 'Pop-ups, supper clubs and community gatherings.' },
  { name: 'Wine & Pairing', description: 'Drinks and pairings for home-cooked meals.' },
  { name: 'Budget Eats', description: 'Delicious meals that go easy on the wallet.' },
  { name: 'Family Meals', description: 'Crowd-pleasers for the whole family.' },
  { name: 'Interviews', description: 'Conversations with chefs and food lovers.' },
];

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
function article(blocks: ([string, string] | string)[]): string {
  return blocks
    .map((b) =>
      Array.isArray(b) ? `<h2>${b[0]}</h2>\n<p>${b[1]}</p>` : `<p>${b}</p>`,
    )
    .join('\n');
}

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

type Seed = {
  title: string;
  category: string;
  featured?: boolean;
  image: string;
  excerpt: string;
  body: string;
  tags?: string[];
};

const POSTS: Seed[] = [
  {
    title: 'How Potluck Brings Home Chefs and Food Lovers Together',
    category: 'Home Dining Tips',
    featured: true,
    image: IMG('photo-1556910103-1c02745aae4d'),
    excerpt: 'A look at how Potluck connects talented home cooks in Singapore with neighbours hungry for an authentic, home-cooked meal.',
    tags: ['Potluck', 'Home Dining', 'Singapore', 'Marketplace'],
    body: article([
      'There is something a restaurant can rarely replicate: the warmth of a meal cooked in someone’s own kitchen, served at their own table. Potluck exists to make those moments easy to find.',
      ['The idea', 'Singapore is full of extraordinary home cooks — the aunty whose rendang takes a whole day, the neighbour whose laksa paste is a closely guarded secret. Potluck gives them a simple way to share their cooking and earn from it.'],
      ['How it works', 'Browse chefs near you, pick a dish, choose a date and request a booking. The chef confirms, you turn up, and you share a meal made with care. No commercial kitchen, no compromise on authenticity.'],
      'Every booking supports a real person doing what they love. That is the heart of home dining — and the reason we built Potluck.',
    ]),
  },
  {
    title: 'A Beginner’s Guide to Peranakan Cuisine',
    category: 'Peranakan',
    featured: true,
    image: IMG('photo-1604908176997-125f25cc6f3d'),
    excerpt: 'Buah keluak, rempah and the patient art of Nyonya cooking — where to start if you’re new to Peranakan food.',
    tags: ['Peranakan', 'Nyonya', 'Buah Keluak', 'Rempah', 'Heritage'],
    body: article([
      'Peranakan cuisine is the delicious result of Chinese ingredients meeting Malay spices over generations of intermarriage and migration. The flavours are bold, sour, spicy and deeply aromatic.',
      ['Start with the rempah', 'Almost every Nyonya dish begins with a rempah — a spice paste pounded from shallots, chilli, candlenut, lemongrass and belacan. Pounding by hand releases oils a blender never will.'],
      ['Three dishes to try', 'Ayam buah keluak (chicken with black nuts), laksa lemak (coconut curry noodles) and kueh pie tee (“top hats” filled with turnip) are perfect introductions to the cuisine.'],
      'Book a Peranakan home chef on Potluck and you will taste the difference patience makes.',
    ]),
  },
  {
    title: 'Hosting Your First Home Dinner: A Simple Checklist',
    category: 'Home Dining Tips',
    image: IMG('photo-1414235077428-338989a2e8c0'),
    excerpt: 'Thinking of hosting? Here’s a no-stress checklist to make your first home dinner a success.',
    tags: ['Home Dining', 'Hosting', 'Entertaining', 'Tips'],
    body: article([
      'You do not need a chef’s kitchen to host a memorable meal — just a little planning and a generous spirit.',
      ['Plan the menu around you', 'Cook what you cook best. A confident, well-made dish beats an ambitious one you have never tried.'],
      ['Prep ahead', 'Do as much as possible before guests arrive: chop, marinate and set the table. The goal is to spend time with people, not hidden in the kitchen.'],
      ['Mind dietary needs', 'Ask about allergies and preferences when guests book. On Potluck, diners can flag this up front.'],
      'Light a candle, pour a drink, and relax. Hospitality is felt more than it is plated.',
    ]),
  },
  {
    title: 'The Secret to a 12-Hour Pho Broth',
    category: 'Recipes',
    image: IMG('photo-1582878826629-29b7ad1cdc43'),
    excerpt: 'Why great pho takes time — and how home chefs coax so much depth from bones, charred aromatics and patience.',
    tags: ['Pho', 'Vietnamese', 'Broth', 'Recipes'],
    body: article([
      'A good bowl of pho lives or dies by its broth. The best ones simmer for half a day, building a clear, fragrant stock that needs no shortcuts.',
      ['Char your aromatics', 'Blackening onion and ginger over a flame before they hit the pot adds a smoky sweetness that defines the broth.'],
      ['Skim, don’t boil', 'Keep the pot at a bare simmer and skim often. A rolling boil makes the broth cloudy and muddy in flavour.'],
      'Finish with fish sauce, rock sugar and a basket of fresh herbs at the table. Simple, but never quick.',
    ]),
  },
  {
    title: 'Why Fermented Food Belongs on Your Table',
    category: 'Korean',
    image: IMG('photo-1583224964978-2257b960c3d3'),
    excerpt: 'From kimchi to gochujang, fermentation is the quiet engine behind Korea’s most addictive flavours.',
    tags: ['Korean', 'Kimchi', 'Fermentation', 'Gochujang'],
    body: article([
      'Fermentation is one of the oldest culinary technologies, and Korean cuisine has perfected it. The payoff is flavour with extraordinary depth — sour, funky, savoury and alive.',
      ['Kimchi is a living thing', 'A good kimchi keeps changing in the fridge, sharpening over weeks. Use young kimchi fresh and older kimchi in stews and fried rice.'],
      ['Build a pantry', 'Gochujang, doenjang and ganjang form the backbone of countless dishes. A spoonful transforms a simple bowl of rice.'],
      'Book a Korean home chef to taste house-fermented banchan you simply cannot buy.',
    ]),
  },
  {
    title: 'Meet the Chef: Sarah’s Nyonya Kitchen',
    category: 'Chef Stories',
    featured: true,
    image: IMG('photo-1577219491135-ce391730fb2c'),
    excerpt: 'Third-generation cook Sarah Tan on rempah, memory and cooking the food of her grandmother.',
    tags: ['Peranakan', 'Chef Story', 'Katong', 'Rempah', 'Nyonya'],
    body: article([
      'Sarah Tan learned to cook standing on a stool beside her grandmother in Katong, pounding rempah until her arms ached. Today she shares that food through Potluck.',
      ['On tradition', '“You cannot rush buah keluak,” she says. “The nuts soak for days. The flavour is the reward for patience.”'],
      ['On sharing', 'For Sarah, hosting strangers feels natural. “When people eat my food, they’re eating my family’s history. That’s a privilege to give.”'],
      'You can book a seat at Sarah’s table through her Potluck profile.',
    ]),
  },
  {
    title: 'Eating Well on a Budget in Singapore',
    category: 'Budget Eats',
    image: IMG('photo-1512621776951-a57141f2eefd'),
    excerpt: 'Delicious, affordable home cooking proves that good food doesn’t have to be expensive.',
    tags: ['Budget Eats', 'Home Cooking', 'Singapore', 'Affordable'],
    body: article([
      'Great food is not about expensive ingredients — it is about technique, seasoning and care. Some of the most satisfying meals are also the cheapest.',
      ['Cook with the seasons', 'Vegetables at their peak are cheaper and taste better. Build meals around what is abundant.'],
      ['Stretch your proteins', 'Braises, curries and stir-fries make a little meat go a long way, especially over rice.'],
      'On Potluck you will find budget-friendly home chefs serving generous, soulful plates.',
    ]),
  },
  {
    title: 'The Art of the Singapore Hawker Classic at Home',
    category: 'Singapore Hawker',
    image: IMG('photo-1617093727343-374698b1b08d'),
    excerpt: 'Chicken rice, char kway teow, mee rebus — how home chefs recreate hawker magic.',
    tags: ['Hawker', 'Chicken Rice', 'Char Kway Teow', 'Singapore', 'Heritage'],
    body: article([
      'Hawker food is Singapore’s edible heritage. Recreating it at home is a labour of love that rewards attention to detail.',
      ['Chicken rice is about the rice', 'The chicken matters, but the rice — cooked in stock and rendered fat — is what people remember.'],
      ['Wok hei takes heat', 'That smoky char in char kway teow comes from a screaming-hot wok and quick hands.'],
      'Find home chefs serving their take on the classics across the island.',
    ]),
  },
  {
    title: 'Plant-Based Indian Cooking That Satisfies',
    category: 'Vegetarian',
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'Indian cuisine is a treasure trove for vegetarians — here’s why it never feels like you’re missing out.',
    tags: ['Vegetarian', 'Indian', 'Dal', 'Thali', 'Plant-Based'],
    body: article([
      'Few cuisines do vegetarian food as joyfully as Indian cooking. Lentils, paneer and vegetables are treated as stars, not substitutes.',
      ['Spices do the heavy lifting', 'Tempering whole spices in hot oil — a tadka — unlocks aromas that make a simple dal sing.'],
      ['Balance the thali', 'A great thali balances textures and flavours: something creamy, something crunchy, something sour, something sweet.'],
      'Book a vegetarian Indian home chef and taste how complete plant-based eating can be.',
    ]),
  },
  {
    title: 'Reunion Dinner: Cooking for the Whole Family',
    category: 'Festive Cooking',
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'Tips for pulling off a festive feast — from menu planning to timing it all to the table.',
    tags: ['Festive', 'Reunion Dinner', 'Family Meals', 'Hosting'],
    body: article([
      'Festive meals carry weight: they are about family, memory and tradition. Cooking for a crowd is daunting, but a plan makes it joyful.',
      ['Work backwards from the table', 'Decide your serving time, then schedule each dish so everything lands hot together.'],
      ['Lean on make-ahead dishes', 'Braises and soups often taste better the next day — cook them in advance and free up the big day.'],
      'Too much to handle? A Potluck home chef can cater your reunion with dishes made just like home.',
    ]),
  },
  {
    title: 'Understanding Japanese Omakase',
    category: 'Japanese',
    image: IMG('photo-1579871494447-9811cf80d66c'),
    excerpt: '“I leave it to you” — the trust and craft behind an omakase meal.',
    tags: ['Japanese', 'Omakase', 'Sushi', 'Fine Dining'],
    body: article([
      'Omakase means entrusting the meal to the chef. It is less a menu than a relationship between cook and guest.',
      ['Seasonality first', 'The chef builds the meal around what is best that day, often fish flown in within hours.'],
      ['Pace and progression', 'Dishes move from light to rich, each one designed to set up the next bite.'],
      'An intimate home omakase on Potluck is one of the most memorable meals you can book.',
    ]),
  },
  {
    title: 'Meal Prep for a Busy Week',
    category: 'Meal Prep',
    image: IMG('photo-1543339308-43e59d6b73a6'),
    excerpt: 'Batch-cook smarter, eat better, and reclaim your weeknights.',
    tags: ['Meal Prep', 'Batch Cooking', 'Weeknight', 'Tips'],
    body: article([
      'A couple of focused hours on a Sunday can transform your week. The trick is to prep components, not just finished meals.',
      ['Cook bases, mix later', 'Grains, proteins and sauces stored separately can be combined into different meals all week.'],
      ['Store it right', 'Cool food quickly and use airtight containers. Label with dates so nothing gets forgotten.'],
      'Prefer someone else to do the cooking? Order home-cooked meals from a Potluck chef nearby.',
    ]),
  },
  {
    title: 'The Story Behind Singapore’s Love of Chilli',
    category: 'Food Culture',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'From sambal to chilli crab, why heat is woven through the Singapore table.',
    tags: ['Food Culture', 'Sambal', 'Chilli Crab', 'Singapore', 'Spice'],
    body: article([
      'Ask a Singaporean about chilli and you will get strong opinions. Sambal, achar, chilli padi — heat is not an afterthought here, it is identity.',
      ['Many chillies, many roles', 'Some bring fragrance, some bring fire. Knowing which to use is its own quiet expertise.'],
      ['A condiment culture', 'A meal often comes with a personal arsenal of sauces, each adjusting the dish to taste.'],
      'Discover home chefs whose house-made sambals are worth the trip alone.',
    ]),
  },
  {
    title: 'Cooking Sustainably at Home',
    category: 'Sustainability',
    image: IMG('photo-1542838132-92c53300491e'),
    excerpt: 'Small habits — seasonal buying, root-to-leaf cooking, less waste — add up to a lighter footprint.',
    tags: ['Sustainability', 'Seasonal', 'Zero Waste', 'Home Cooking'],
    body: article([
      'Sustainable cooking is rarely about big sacrifices. It is a series of small, satisfying habits that also make food taste better.',
      ['Buy what’s in season', 'Seasonal produce travels less, costs less and tastes more like itself.'],
      ['Use the whole vegetable', 'Stems, tops and trimmings become stocks, pestos and stir-fries instead of waste.'],
      'Many Potluck chefs cook seasonally by instinct — ask them what is good this week.',
    ]),
  },
  {
    title: 'Behind the Kitchen: A Day with a Home Chef',
    category: 'Behind the Kitchen',
    image: IMG('photo-1556909114-f6e7ad7d3136'),
    excerpt: 'From morning market runs to the last plate served, a day in the life of a Potluck chef.',
    tags: ['Behind The Kitchen', 'Chef Story', 'Wet Market', 'Home Chef'],
    body: article([
      'A home chef’s day starts long before guests arrive. We followed one from dawn to dishes.',
      ['The market run', 'Freshness is everything. The best chefs build their menu around what looked good at the market that morning.'],
      ['Mise en place', 'Hours of quiet prep — chopping, marinating, simmering — set up a service that looks effortless.'],
      'The reward? Watching strangers become friends over a plate of food you made.',
    ]),
  },
  {
    title: 'Wine and Spice: Pairings for Spicy Food',
    category: 'Wine & Pairing',
    image: IMG('photo-1510812431401-41d2bd2722f3'),
    excerpt: 'Heat and alcohol can clash — here’s how to pair drinks with bold, spicy dishes.',
    tags: ['Wine Pairing', 'Spicy Food', 'Drinks', 'Hosting'],
    body: article([
      'Pairing wine with spicy food is tricky: high alcohol amplifies heat, while sweetness and bubbles tame it.',
      ['Reach for off-dry whites', 'A slightly sweet Riesling or Gewürztraminer cools the palate and complements aromatic spice.'],
      ['Bubbles are your friend', 'Sparkling wine refreshes between fiery bites — and feels festive too.'],
      'Not a wine drinker? Cold barley water or a tart calamansi cooler works beautifully.',
    ]),
  },
  {
    title: 'Healthy Eating Without the Boredom',
    category: 'Healthy Eating',
    image: IMG('photo-1490645935967-10de6ba17061'),
    excerpt: 'Nourishing food can be exciting — it’s all about flavour, colour and balance.',
    tags: ['Healthy Eating', 'Balanced', 'Nutrition', 'Home Cooking'],
    body: article([
      'Healthy eating gets a bad reputation, usually because it is done joylessly. Done well, it is some of the most vibrant food there is.',
      ['Flavour first', 'Herbs, citrus, chilli and good fats make vegetables crave-worthy.'],
      ['Eat the rainbow', 'A colourful plate is usually a balanced one — and far more appetising.'],
      'Find home chefs who specialise in fresh, balanced cooking that never feels like a diet.',
    ]),
  },
  {
    title: 'The Comfort of a Good Claypot',
    category: 'Chinese',
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'Smoky, crispy-bottomed and deeply satisfying — the enduring appeal of claypot rice.',
    tags: ['Chinese', 'Claypot Rice', 'Cantonese', 'Comfort Food'],
    body: article([
      'Few dishes comfort like a claypot rice, its bottom layer crisped into golden, smoky crust the Cantonese call “faan ziu”.',
      ['It’s all about the pot', 'A seasoned claypot holds and radiates heat, crisping the rice while keeping the top fluffy.'],
      ['Patience at the end', 'Letting it rest off the heat lets the crust set and the flavours settle.'],
      'Book a Cantonese home chef and order it fresh from the pot.',
    ]),
  },
  {
    title: 'Family Meals That Bring Everyone to the Table',
    category: 'Family Meals',
    image: IMG('photo-1547573854-74d2a71d0826'),
    excerpt: 'Crowd-pleasing dishes that make weeknight dinners something to look forward to.',
    tags: ['Family Meals', 'Weeknight', 'Crowd-Pleasers', 'Home Cooking'],
    body: article([
      'The family meal is under pressure from busy schedules — but a dish everyone loves still has the power to gather people.',
      ['Build-your-own wins', 'Tacos, wraps and rice bowls let everyone customise, which keeps fussy eaters happy.'],
      ['One-pot wonders', 'Curries, stews and bakes mean more time at the table and fewer dishes in the sink.'],
      'Order family-sized portions from a Potluck chef when cooking just isn’t happening.',
    ]),
  },
  {
    title: 'An Interview with a First-Time Potluck Host',
    category: 'Interviews',
    image: IMG('photo-1529692236671-f1f6cf9683ba'),
    excerpt: 'A new home chef shares what surprised her about hosting strangers for dinner.',
    tags: ['Interview', 'Home Chef', 'Hosting', 'Community'],
    body: article([
      'We sat down with a chef three months into her Potluck journey to hear how it has gone.',
      ['On nerves', '“I was terrified before my first booking. Then the guests walked in, smelled the food, and the nerves vanished.”'],
      ['On community', '“Some guests have become regulars. One even brought me a plant for my kitchen. It feels like making friends.”'],
      'Thinking of hosting? Her advice: “Start with one dish you love. The rest follows.”',
    ]),
  },

  // ---------------------------------------------------------------------------
  // Chef spotlights — each introduces one home chef and links to /chef/{slug}
  // ---------------------------------------------------------------------------
  {
    title: 'Chef Daniel Lim and the Quiet Perfection of Hainanese Chicken Rice',
    category: 'Singapore Hawker',
    featured: true,
    image: IMG('photo-1617093727343-374698b1b08d'),
    excerpt: 'In Ang Mo Kio, Chef Daniel Lim cooks a Hainanese chicken rice so silky it converts sceptics — here’s the story behind the plate.',
    tags: ['Hainanese Chicken Rice', 'Hainanese', 'Ang Mo Kio', 'Hawker', 'Chef Spotlight'],
    body: article([
      'Hainanese chicken rice is deceptively simple, which is exactly why it is so hard to do well. In Ang Mo Kio, <a href="/chef/daniel-lim">Chef Daniel Lim</a> has spent years chasing the perfect version — poached chicken with a silky skin, rice fragrant with stock and rendered fat, and a chilli sauce that wakes the whole dish up.',
      ['A dish passed down', 'Daniel’s recipe traces back to his Hainanese grandfather, who ran a coffee shop stall for decades. The chicken is plunged into an ice bath the moment it is poached, setting that gelatinous, glassy skin diners go quiet over.'],
      ['Why the rice matters most', 'Ask Daniel what people remember and he will point to the rice, not the bird. Each grain is fried with garlic and ginger before steaming in chicken stock, so it carries the meal even before the chilli arrives.'],
      ['Beyond the classic', 'His Hainanese pork chop — crumbed, fried and napped in a tangy tomato-and-pea gravy — is the old kopitiam dish few stalls still make. Order both and you taste a whole era of Singapore dining.'],
      'This is chicken rice you will not find at any stall or food court — it comes from a family recipe Daniel guards closely, cooked in his own kitchen with years of practice behind every plate. Eat at his table and it is cooked just for you and your guests, made to order rather than scooped from a tray.',
      '<strong>Hungry? <a href="/chef/daniel-lim">Book Chef Daniel Lim on Potluck →</a></strong> A plate of his chicken rice from around SGD 12 is the easiest yes you will make this week — an intimate home-dining experience no restaurant can match.',
    ]),
  },
  {
    title: 'Kaya, Kopi and Chicken Rice: A Morning with Chef Lim Ah Seng',
    category: 'Chef Stories',
    image: IMG('photo-1556910103-1c02745aae4d'),
    excerpt: 'Chef Lim Ah Seng of Bishan serves the kind of kaya toast breakfast set that makes you slow right down.',
    tags: ['Kaya Toast', 'Hainanese Chicken Rice', 'Bishan', 'Kopitiam', 'Chef Spotlight'],
    body: article([
      'Some chefs cook dinner. <a href="/chef/lim-ah-seng">Chef Lim Ah Seng</a> in Bishan cooks mornings — the unhurried, soft-boiled-egg kind of breakfast that Singapore is quietly losing.',
      ['The breakfast set done right', 'His kaya toast breakfast set is charcoal-toasted bread, a thick slab of cold butter and house-made kaya pandan-green and fragrant. On the side: two eggs cooked just past runny, splashed with dark soy and white pepper.'],
      ['And then, the chicken rice', 'By midday Ah Seng switches to the dish that made his name — a Hainanese chicken rice with a clear, gingery broth that he insists you sip first, before the chicken.'],
      ['Old-school, on purpose', '“People want fast food fast,” he says. “I want them to sit down properly.” His table is for lingering, not takeaway.'],
      'You will not get this kaya — stirred by hand from his own closely-held recipe — in any café or food court. It is the fruit of decades of practice, cooked fresh in his home kitchen and served just to you and yours, an intimate breakfast no chain can imitate.',
      '<strong>Hungry? <a href="/chef/lim-ah-seng">Book Chef Lim Ah Seng on Potluck →</a></strong> Start your weekend with a breakfast that tastes like an old kopitiam, cooked at his table for you alone.',
    ]),
  },
  {
    title: 'Nasi Lemak and Mee Siam: Chef Roslan Bakar’s Tampines Table',
    category: 'Malay',
    featured: true,
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'Coconut rice, a sambal with serious depth, and a mee siam gravy worth the trip to Tampines.',
    tags: ['Nasi Lemak', 'Mee Siam', 'Malay', 'Tampines', 'Sambal'],
    body: article([
      'Nasi lemak lives or dies by two things: the rice and the sambal. In Tampines, <a href="/chef/roslan-bakar">Chef Roslan Bakar</a> nails both, and that is before you reach his mee siam.',
      ['The sambal is the soul', 'Roslan’s sambal is slow-cooked for hours until the chillies turn dark, sweet and smoky. It is the kind of sambal regulars ask to buy by the jar.'],
      ['Rice with real lemak', 'His coconut rice is steamed over pandan with a pinch more santan than is strictly sensible — rich, fragrant and unapologetically indulgent.'],
      ['Don’t skip the mee siam', 'The mee siam special arrives in a tangy, spicy-sweet gravy bright with tamarind, topped with prawns, egg and a squeeze of calamansi. It is a Saturday-morning order if ever there was one.'],
      'That sambal recipe is Roslan’s family secret, refined over years until the balance is exactly his — a taste you will not find at any hawker stall. Cooked in his own kitchen and served fresh to your table, it is a personal home-dining experience, made to order for you and your guests.',
      '<strong>Hungry? <a href="/chef/roslan-bakar">Book Chef Roslan Bakar on Potluck →</a></strong> A nasi lemak special starts around SGD 8 and feeds a serious craving.',
    ]),
  },
  {
    title: 'Wok Hei in the Heartlands: Chef Tan Boon Huat’s Char Kway Teow',
    category: 'Singapore Hawker',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'Smoky, glossy, properly charred — the char kway teow Chef Tan Boon Huat fries in Hougang is the real thing.',
    tags: ['Char Kway Teow', 'Carrot Cake', 'Hawker', 'Hougang', 'Wok Hei'],
    body: article([
      'You can hear good char kway teow before you taste it — the roar of a wok, the hiss of noodles hitting screaming-hot oil. In Hougang, <a href="/chef/tan-boon-huat">Chef Tan Boon Huat</a> brings that hawker theatre to a home kitchen.',
      ['Wok hei is not optional', 'Boon Huat fries in small batches over a fierce flame so every strand picks up that elusive smoky “breath of the wok”. Cockles, lap cheong, prawns and chives go in fast and come out glossy.'],
      ['The carrot cake too', 'His fried carrot cake comes both ways — white (savoury, soft) and black (sweet with dark soy, caramelised at the edges). Order black if you have a sweet tooth; order both if you are smart.'],
      ['Cooked to order, always', 'Nothing sits under a heat lamp. Each plate is fired the moment you are ready to eat, which is the whole point — an intimate, made-just-for-you experience no food court can offer.'],
      'Two decades at the wok have honed Boon Huat’s timing to something you simply cannot buy off a stall menu. Cooked in his own kitchen, fired one plate at a time for you and your guests, this is char kway teow as a personal home-dining experience.',
      '<strong>Hungry? <a href="/chef/tan-boon-huat">Book Chef Tan Boon Huat on Potluck →</a></strong> for char kway teow with proper wok hei, from about SGD 7 a plate.',
    ]),
  },
  {
    title: 'Hokkien Prawn Mee Done Properly with Chef Goh Kim Hock',
    category: 'Singapore Hawker',
    image: IMG('photo-1617093727343-374698b1b08d'),
    excerpt: 'A prawn stock simmered for hours and an oyster omelette with crisp edges — Toa Payoh’s Chef Goh Kim Hock keeps it old-school.',
    tags: ['Hokkien Mee', 'Oyster Omelette', 'Hokkien', 'Toa Payoh', 'Hawker'],
    body: article([
      'Hokkien prawn mee is a dish of patience: it is only as good as the stock beneath it. In Toa Payoh, <a href="/chef/goh-kim-hock">Chef Goh Kim Hock</a> simmers prawn shells and pork bones for hours to build the deep, sweet broth this dish demands.',
      ['The stock is everything', 'Goh roasts his prawn heads before they ever hit the pot, coaxing out a richness that supermarket versions never reach. The noodles soak it all up, finished with a dab of fiery sambal and a squeeze of lime.'],
      ['Oyster omelette with crunch', 'His orh luak — oyster omelette — is fried until the edges shatter, the centre still soft around plump oysters. A splash of vinegar-chilli cuts the richness perfectly.'],
      ['A hawker craft at home', 'Goh learned this at a stall in the 1980s. Cooking it in a home kitchen, he says, lets him take the time the dish actually needs.'],
      'Four decades of practice go into a broth like this, built on a recipe he has never written down — a depth you will not taste at any food court. Cooked in his own kitchen and ladled out fresh for you and your guests, it is an intimate meal made the slow way, just for your table.',
      '<strong>Hungry? <a href="/chef/goh-kim-hock">Book Chef Goh Kim Hock on Potluck →</a></strong> and taste prawn mee that earns its hours.',
    ]),
  },
  {
    title: 'Bak Chor Mee and Bak Kut Teh: Inside Chef Wong Mui Keng’s Teochew Kitchen',
    category: 'Chinese',
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'Peppery broth, springy noodles and a vinegar that ties it all together — Chef Wong Mui Keng cooks Teochew comfort food in Bukit Merah.',
    tags: ['Bak Chor Mee', 'Bak Kut Teh', 'Teochew', 'Bukit Merah', 'Comfort Food'],
    body: article([
      'Teochew cooking prizes clarity and balance over heaviness, and few dishes show that better than a good bak chor mee. In Bukit Merah, <a href="/chef/wong-mui-keng">Chef Wong Mui Keng</a> tosses hers in a dressing where black vinegar, chilli and pork lard meet in perfect tension.',
      ['The toss is the technique', 'Mui Keng dresses the springy noodles tableside-fast so they stay bouncy, then crowns them with minced pork, liver, fish cake and crisp pork lard. Every bite should be tangy, savoury and a little smoky at once.'],
      ['Bak kut teh, the Teochew way', 'Her bak kut teh leans peppery rather than herbal — a clear, garlicky, white-pepper broth that warms you from the inside. Dip the pork ribs in dark soy and chopped chilli and you understand why people order extra rice.'],
      ['Comfort, refined', '“Teochew food is not loud,” she says. “It is honest.” That honesty is exactly what keeps diners coming back.'],
      'Mui Keng’s dressing is a closely-guarded family balance you will not find replicated in any stall — years of practice in the toss alone. Cooked in her own kitchen and tossed to order for you and your guests, it is a personal home-dining experience, not a counter-service plate.',
      '<strong>Hungry? <a href="/chef/wong-mui-keng">Book Chef Wong Mui Keng on Potluck →</a></strong> for a bowl of peppery, vinegary comfort.',
    ]),
  },
  {
    title: 'Roti Prata at Dawn: Chef Farah Ismail’s Geylang Serai Favourites',
    category: 'Halal',
    featured: true,
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'Flaky prata, fragrant briyani and a fish curry to soak it in — Chef Farah Ismail brings Indian-Muslim soul food to the table.',
    tags: ['Roti Prata', 'Nasi Briyani', 'Indian-Muslim', 'Geylang Serai', 'Halal'],
    body: article([
      'There is a rhythm to good prata — the slap, the stretch, the flip — and in Geylang Serai, <a href="/chef/farah-ismail">Chef Farah Ismail</a> has it down to muscle memory. Her roti prata set arrives crisp outside, soft and layered within.',
      ['Prata worth waiting for', 'Farah rests her dough overnight so it pulls thin as paper without tearing. Plain or egg, it comes with a curry built for dipping — not too thick, deeply spiced, just enough heat.'],
      ['Briyani that perfumes the room', 'Her nasi briyani ayam is cooked the long way, rice and chicken layered and dum-steamed so the basmati turns golden and fragrant. You smell it before you see it.'],
      ['Halal home dining', 'Everything Farah cooks is halal, which means her table is one the whole neighbourhood can share. That inclusiveness, she says, is the point.'],
      'Prata this thin and briyani this fragrant come from a recipe handed down in her family and years of muscle memory — a taste no shop or food court delivers. Cooked in her own kitchen and made to order for you and your guests, it is an intimate home-dining experience, not a takeaway counter.',
      '<strong>Hungry? <a href="/chef/farah-ismail">Book Chef Farah Ismail on Potluck →</a></strong> A briyani ayam plate from around SGD 10 is a weekend in itself.',
    ]),
  },
  {
    title: 'Mutton Murtabak and Fish Head Curry with Chef Kadir Hussain',
    category: 'Indian',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'In Little India, Chef Kadir Hussain stuffs murtabak with spiced mutton and simmers a fish head curry that pulls a crowd.',
    tags: ['Murtabak', 'Fish Head Curry', 'Indian-Muslim', 'Little India', 'Halal'],
    body: article([
      'Walk through Little India and the air itself is seasoned. <a href="/chef/kadir-hussain">Chef Kadir Hussain</a> cooks the dishes that scent those streets — starting with a mutton murtabak that is more filling than bread.',
      ['Murtabak, generously stuffed', 'Kadir’s murtabak is packed with minced mutton, onion and egg, the dough fried until shatteringly crisp. He serves it with a sweet-sharp onion-vinegar dip and a ladle of curry on the side.'],
      ['The famous fish head curry', 'His fish head curry is the showstopper — a tamarind-bright, lip-tingling gravy crowded with okra and brinjal around a generous red snapper head. It is built for sharing over a long, loud table.'],
      ['Spice with intent', '“Every spice has a job,” Kadir says. He toasts and grinds his own masala, because pre-ground, he insists, is already losing its soul.'],
      'His masala blend is a family recipe he keeps close, ground fresh with a skill years in the making — a depth no restaurant or stall version reaches. Cooked in his own kitchen and simmered to order for you and your guests, it turns dinner into a personal, made-for-your-table occasion.',
      '<strong>Hungry? <a href="/chef/kadir-hussain">Book Chef Kadir Hussain on Potluck →</a></strong> and gather a few friends — the fish head curry is best shared.',
    ]),
  },
  {
    title: 'Green Curry and Pad Thai: Chef Somchai Prasert’s Joo Chiat Thai',
    category: 'Food Culture',
    image: IMG('photo-1582878826629-29b7ad1cdc43'),
    excerpt: 'A green curry pounded from scratch and a pad thai with proper balance — Chef Somchai Prasert cooks Bangkok flavour in Joo Chiat.',
    tags: ['Green Curry', 'Pad Thai', 'Thai', 'Joo Chiat', 'Chef Spotlight'],
    body: article([
      'Thai food is a tightrope walk between hot, sour, salty and sweet. In Joo Chiat, <a href="/chef/somchai-prasert">Chef Somchai Prasert</a> walks it without a wobble, beginning with a green curry paste he still pounds by hand.',
      ['The paste makes the curry', 'Somchai grinds green chilli, galangal, lemongrass, kaffir lime and shrimp paste into a fragrant rempah, then simmers it in coconut milk until the oil splits and the chicken turns silky. Fresh Thai basil goes in at the very end.'],
      ['Pad thai, balanced not sweet', 'His pad thai resists the sugary trap — tamarind brings the sourness, fish sauce the salt, and a scatter of crushed peanuts and lime keeps it bright. The noodles stay separate, never claggy.'],
      ['Cooked like home', 'Somchai cooks the way his mother did in Bangkok — tasting constantly, adjusting always. No two batches are identical, and that is the charm.'],
      'That hand-pounded paste follows his mother’s recipe, refined over years of cooking it by feel — a taste you will not find in any Thai restaurant here. Cooked in his own kitchen and adjusted to your table on the day, it is an intimate home-dining experience made just for you and your guests.',
      '<strong>Hungry? <a href="/chef/somchai-prasert">Book Chef Somchai Prasert on Potluck →</a></strong> for a green curry that earns its heat.',
    ]),
  },
  {
    title: 'Tom Yum That Sings: Chef Apinya Suwan’s Clementi Kitchen',
    category: 'Food Culture',
    image: IMG('photo-1582878826629-29b7ad1cdc43'),
    excerpt: 'A tom yum goong loud with lemongrass and lime, and a mango sticky rice to cool you down — Chef Apinya Suwan’s Thai classics.',
    tags: ['Tom Yum', 'Mango Sticky Rice', 'Thai', 'Clementi', 'Chef Spotlight'],
    body: article([
      'A great tom yum should make you sit up straight. In Clementi, <a href="/chef/apinya-suwan">Chef Apinya Suwan</a> builds hers to do exactly that — hot, sour and ringing with lemongrass, galangal and kaffir lime.',
      ['Tom yum goong, full throttle', 'Apinya uses plump river prawns and their heads, which give the broth its luscious orange sheen. A final squeeze of lime and a handful of bird’s eye chilli bring the whole bowl alive.'],
      ['Mango sticky rice to finish', 'Her khao niew mamuang is the cool-down: warm coconut sticky rice, sweet ripe mango and a drizzle of salted coconut cream. The salty-sweet contrast is what makes it unforgettable.'],
      ['From Chiang Mai with care', 'Apinya grew up cooking in the north of Thailand, and she sources her herbs fresh weekly because, she says, “tom yum from dried lemongrass is just soup.”'],
      'This is northern-Thai cooking from her own family recipes, sharpened by a lifetime at the stove — a taste no restaurant menu here carries. Cooked in her own kitchen and made to order for you and your guests, it is a personal home-dining experience rather than a table for forty.',
      '<strong>Hungry? <a href="/chef/apinya-suwan">Book Chef Apinya Suwan on Potluck →</a></strong> and end with the best mango sticky rice in the west.',
    ]),
  },
  {
    title: 'Kimchi Jjigae and Japchae: A Seat at Chef Park Ji-ho’s Table',
    category: 'Korean',
    featured: true,
    image: IMG('photo-1583224964978-2257b960c3d3'),
    excerpt: 'House-fermented kimchi, a bubbling stew and glass noodles done right — Chef Park Ji-ho brings Seoul comfort to Tanjong Pagar.',
    tags: ['Kimchi Jjigae', 'Japchae', 'Korean', 'Tanjong Pagar', 'Chef Spotlight'],
    body: article([
      'Korean comfort food is built on fermentation and patience, and in Tanjong Pagar, <a href="/chef/park-ji-ho">Chef Park Ji-ho</a> has both in spades. His kimchi ferments for weeks before it ever meets a pot.',
      ['Kimchi jjigae with depth', 'Ji-ho uses aged, sour kimchi for his jjigae — the older it gets, the better the stew. Pork belly, tofu and a splash of the kimchi brine simmer into a fiery, deeply savoury bowl that arrives still bubbling.'],
      ['Japchae, glossy and balanced', 'His japchae is a small lesson in restraint: sweet-potato glass noodles tossed with sesame oil, julienned vegetables and beef, each ingredient cooked separately so nothing turns soggy.'],
      ['Banchan you can’t buy', 'Every meal opens with a spread of house-made banchan — pickles, namul, marinated greens — that changes with whatever he has fermenting. You will not find these on any restaurant menu; they come from his own kitchen and his own ferments, the fruit of years of patient practice.'],
      '<strong>Hungry? <a href="/chef/park-ji-ho">Book Chef Park Ji-ho on Potluck →</a></strong> for a Korean home meal you will keep thinking about — cooked just for you and your guests, an intimate table no Korean BBQ chain can match.',
    ]),
  },
  {
    title: 'Banh Mi and Bun Bo Hue: Chef Tran Van Minh’s Vietnamese Kitchen',
    category: 'Food Culture',
    image: IMG('photo-1582878826629-29b7ad1cdc43'),
    excerpt: 'A crackly banh mi and a fiercely fragrant bun bo hue — Chef Tran Van Minh cooks central-Vietnam flavour in Sengkang.',
    tags: ['Banh Mi', 'Bun Bo Hue', 'Vietnamese', 'Sengkang', 'Chef Spotlight'],
    body: article([
      'Vietnamese food is all about contrast — crunch against soft, herb against heat. In Sengkang, <a href="/chef/tran-van-minh">Chef Tran Van Minh</a> builds a banh mi thit that gets every contrast right.',
      ['The banh mi, layer by layer', 'Minh toasts the baguette so it shatters, then layers pâté, cold cuts, pickled carrot and daikon, cucumber, coriander and chilli. The pickles cut the richness; the herbs lift everything. It is a full meal in a sandwich.'],
      ['Bun bo hue, the bolder cousin of pho', 'His bun bo hue comes from central Vietnam — a lemongrass-and-chilli broth far spicier and more robust than pho, loaded with thick round noodles, beef shank and a slick of fragrant chilli oil on top.'],
      ['Herbs by the handful', 'Minh serves both with a generous plate of fresh herbs and lime, because in Vietnamese cooking, he says, the table finishes the dish, not the kitchen.'],
      'His bun bo hue follows a central-Vietnam family recipe you will not taste at any local eatery, built on years of practice with the lemongrass-and-chilli broth. Cooked in his own kitchen and assembled fresh for you and your guests, it is a personal, made-to-order home-dining experience.',
      '<strong>Hungry? <a href="/chef/tran-van-minh">Book Chef Tran Van Minh on Potluck →</a></strong> A banh mi thit from around SGD 7 is lunch sorted.',
    ]),
  },
  {
    title: 'Chicken Adobo and Pancit: Chef Rowena Dela Cruz’s Filipino Comfort',
    category: 'Food Culture',
    image: IMG('photo-1547573854-74d2a71d0826'),
    excerpt: 'Tangy, garlicky adobo and a pancit bihon for the whole table — Chef Rowena Dela Cruz cooks Filipino home food in Yishun.',
    tags: ['Chicken Adobo', 'Pancit', 'Filipino', 'Yishun', 'Chef Spotlight'],
    body: article([
      'Ask any Filipino about adobo and you will start an affectionate argument — everyone’s family does it differently. In Yishun, <a href="/chef/rowena-delacruz">Chef Rowena Dela Cruz</a> cooks hers the way her lola did, and it is hard to argue with the result.',
      ['Adobo, tangy and deep', 'Rowena braises chicken slowly in vinegar, soy, garlic, bay leaf and peppercorn until the sauce reduces to a glossy, savoury-sour glaze. She finishes it in the pan so the edges catch and caramelise.'],
      ['Pancit for a crowd', 'Her pancit bihon — thin rice noodles tossed with chicken, prawns and crisp vegetables — is the dish that turns up at every Filipino celebration, a symbol of long life and good fortune.'],
      ['Food as fiesta', '“Filipino cooking is meant to be shared loudly,” Rowena says. Her portions are generous because, in her words, “no one should leave a Filipino table still hungry.”'],
      'Her adobo is her lola’s recipe, kept in the family and perfected over years — a taste you simply will not find on any restaurant menu in Singapore. Cooked in her own kitchen and served fresh to your table, it is an intimate home-dining experience made just for you and your guests.',
      '<strong>Hungry? <a href="/chef/rowena-delacruz">Book Chef Rowena Dela Cruz on Potluck →</a></strong> and bring the whole family.',
    ]),
  },
  {
    title: 'Ayam Masak Merah and Sayur Lodeh: Chef Nurul Huda’s Kampung Classics',
    category: 'Malay',
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'A sweet-spicy chicken in red gravy and a coconut vegetable stew — Chef Nurul Huda cooks kampung comfort in Woodlands.',
    tags: ['Ayam Masak Merah', 'Sayur Lodeh', 'Malay', 'Woodlands', 'Halal'],
    body: article([
      'Some dishes taste like a grandmother’s kitchen no matter whose grandmother it was. In Woodlands, <a href="/chef/nurul-huda">Chef Nurul Huda</a> cooks exactly that kind of food — unhurried, generous Malay home cooking.',
      ['Ayam masak merah', 'Her signature is chicken simmered in a sweet, spicy tomato-and-chilli gravy, fried first so the skin holds up, then bathed in rempah until the sauce clings to every piece. It is festive-table food she happily makes any day.'],
      ['Sayur lodeh to round it out', 'Her sayur lodeh is a gentle coconut stew of long beans, cabbage, tempeh and tofu — the dish that quietly anchors a Malay spread and soaks up every drop of rice.'],
      ['Cooked with sabar', '“You cannot hurry rempah,” Nurul says, using the Malay word for patience. The depth in her gravies is simply time, applied with love.'],
      'These are kampung recipes carried down in her family — a taste you will not find in any halal restaurant or food court, built on years of practice with the rempah. Cooked in her own kitchen and made to order for you and your guests, it is a warm, personal home-dining experience.',
      '<strong>Hungry? <a href="/chef/nurul-huda">Book Chef Nurul Huda on Potluck →</a></strong> for kampung flavours made the slow way.',
    ]),
  },
  {
    title: 'Babi Pongteh and Chap Chye: Chef Evelyn Koh’s Katong Nyonya Table',
    category: 'Peranakan',
    featured: true,
    image: IMG('photo-1604908176997-125f25cc6f3d'),
    excerpt: 'Tau cheo-braised pork and a soulful chap chye — Chef Evelyn Koh keeps Katong’s Peranakan heritage alive.',
    tags: ['Babi Pongteh', 'Chap Chye', 'Peranakan', 'Katong', 'Nyonya'],
    body: article([
      'In Katong, the Peranakan heart of Singapore, <a href="/chef/evelyn-koh">Chef Evelyn Koh</a> cooks the dishes that defined her childhood — slow, layered Nyonya food that rewards every minute it takes.',
      ['Babi pongteh', 'Her babi pongteh is pork belly braised low and long with fermented soybean paste (tau cheo), gula melaka and mushrooms until the sauce turns dark, sweet and savoury. It tastes even better the next day, which she will happily tell you.'],
      ['Chap chye with depth', 'Her nyonya chap chye is no ordinary mixed-vegetable stew — cabbage, fungus, lily buds and glass noodles braised in prawn stock and tau cheo into something far more than the sum of its parts.'],
      ['Heritage on a plate', '“Peranakan food is disappearing because no one has the time,” Evelyn says. “So I make the time.” Every booking is, in a small way, an act of preservation. These are closely-guarded family recipes you will not find in any restaurant, cooked in her own kitchen with the refined skill only years of practice bring.'],
      '<strong>Hungry? <a href="/chef/evelyn-koh">Book Chef Evelyn Koh on Potluck →</a></strong> and taste Katong’s heritage on a plate — cooked just for you and your guests, an intimate home table no eatery can replicate.',
    ]),
  },
  {
    title: 'Banana Leaf and Idli: Chef Meera Pillai’s Vegetarian South Indian',
    category: 'Vegetarian',
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'A banana-leaf veg meal that keeps refilling and idli soft as clouds — Chef Meera Pillai’s Queenstown kitchen proves vegetarian is never a compromise.',
    tags: ['Banana Leaf', 'Idli Sambar', 'South Indian', 'Vegetarian', 'Queenstown'],
    body: article([
      'A South Indian banana-leaf meal is a feast disguised as humility. In Queenstown, <a href="/chef/meera-pillai">Chef Meera Pillai</a> lays out a vegetarian spread so generous you forget there was ever meat on the menu.',
      ['The banana-leaf meal', 'Rice in the centre, ringed by sambar, rasam, poriyal, kootu, pickle and pappadum — Meera’s spread hits sour, spicy, sweet and savoury all at once, and she will keep refilling until you surrender.'],
      ['Idli and sambar, done right', 'Her idli are steamed from a batter fermented overnight, soft and faintly sour, served with a coconut chutney and a sambar bright with tamarind and curry leaf. Simple, but exacting.'],
      ['Spice tempered with care', 'Meera tempers her dishes with mustard seeds, curry leaves and asafoetida bloomed in hot ghee — the tadka that, she insists, is where South Indian flavour really lives.'],
      'Every dish on the leaf follows recipes from her family in Tamil Nadu, honed over years — a spread you will not find at any restaurant buffet. Cooked in her own kitchen and laid out fresh for you and your guests, it is an intimate, made-for-your-table home-dining experience.',
      '<strong>Hungry? <a href="/chef/meera-pillai">Book Chef Meera Pillai on Potluck →</a></strong> for a banana-leaf meal that satisfies completely.',
    ]),
  },
  {
    title: 'Grilled Ribeye by the Sea: Chef James Fernandez in Marine Parade',
    category: 'Western',
    image: IMG('photo-1510812431401-41d2bd2722f3'),
    excerpt: 'A properly rested ribeye and a crisp-skinned barramundi — Chef James Fernandez brings confident Western grilling to Marine Parade.',
    tags: ['Grilled Ribeye', 'Barramundi', 'Western', 'Marine Parade', 'Chef Spotlight'],
    body: article([
      'Great grilling is mostly about restraint — good produce, fire and timing. In Marine Parade, <a href="/chef/james-fernandez">Chef James Fernandez</a> understands that a ribeye does not need ten ingredients, it needs attention.',
      ['The ribeye', 'James seasons his ribeye simply, sears it hard for a deep crust, then rests it properly so every slice runs pink and juicy. A spoon of herb butter melts over the top and that, he says, is plenty.'],
      ['Pan-seared barramundi', 'His barramundi goes into the pan skin-side down and stays there until the skin crackles, the flesh barely set — finished with lemon, capers and a little brown butter.'],
      ['Technique over fuss', '“People over-complicate Western food,” James says. “Cook the protein well and you are most of the way there.” His plates are clean, confident and exactly enough.'],
      'That apparent simplicity hides years of refined technique — the searing, the resting, the timing most kitchens get slightly wrong. Cooked in his own kitchen and plated just for you and your guests, it is a private steak dinner you cannot order at any restaurant, made to order at an intimate home table.',
      '<strong>Hungry? <a href="/chef/james-fernandez">Book Chef James Fernandez on Potluck →</a></strong> for a steak dinner without the restaurant markup.',
    ]),
  },
  {
    title: 'Satay Over Coals and Mee Rebus: Chef Aminah Jalil’s Punggol Kitchen',
    category: 'Halal',
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'Charcoal-grilled satay and a thick, sweet-savoury mee rebus gravy — Chef Aminah Jalil cooks halal local favourites in Punggol.',
    tags: ['Satay', 'Mee Rebus', 'Halal', 'Punggol', 'Local'],
    body: article([
      'Nothing pulls a crowd quite like satay over coals. In Punggol, <a href="/chef/aminah-jalil">Chef Aminah Jalil</a> grills hers the patient way, fanning the charcoal until the skewers char at the edges and stay juicy within.',
      ['Satay with a proper sauce', 'Aminah marinates her chicken in turmeric, lemongrass and coriander, then serves it with a peanut sauce that is thick, nutty and gently spiced — not the watery stuff. Cucumber, onion and ketupat complete the set.'],
      ['Mee rebus, rich and golden', 'Her mee rebus gravy is the labour of love: a thick, sweet-savoury sauce of sweet potato, taucu and spices, ladled over yellow noodles and crowned with boiled egg, green chilli and a squeeze of lime.'],
      ['Halal and heartfelt', 'Everything Aminah cooks is halal, and her table is one she is proud anyone can join. “Food should bring people together, not keep them apart,” she says.'],
      'Her marinade and peanut sauce are family recipes she keeps close, grilled with a patience years in the making — a taste no satay stall or restaurant matches. Cooked in her own kitchen and grilled to order for you and your guests, it is a personal home-dining experience built around your table.',
      '<strong>Hungry? <a href="/chef/aminah-jalil">Book Chef Aminah Jalil on Potluck →</a></strong> for satay grilled the proper way.',
    ]),
  },
  {
    title: 'Ayam Buah Keluak: The Soul of Chef Sarah Tan’s Peranakan Cooking',
    category: 'Peranakan',
    image: IMG('photo-1577219491135-ce391730fb2c'),
    excerpt: 'The black nut that takes days to prepare and a laksa lemak worth queuing for — Chef Sarah Tan’s Tiong Bahru Nyonya kitchen.',
    tags: ['Ayam Buah Keluak', 'Laksa', 'Peranakan', 'Tiong Bahru', 'Nyonya'],
    body: article([
      'If one dish defines Peranakan cooking, it is ayam buah keluak — and few cook it with the devotion of <a href="/chef/sarah-tan">Chef Sarah Tan</a> in Tiong Bahru. The black buah keluak nuts alone take days of soaking and scrubbing before they ever reach the pot.',
      ['Why buah keluak takes days', 'The nuts must be soaked for days to leach out their toxins, then cracked and scooped, the dark earthy paste mixed back with rempah and stuffed into the shells. Sarah braises them with chicken until the gravy turns deep, nutty and faintly bitter — a flavour like nothing else.'],
      ['Laksa lemak for the table', 'Her laksa lemak is the crowd favourite: a rich coconut-and-prawn gravy fragrant with laksa leaf, poured over thick noodles, cockles and prawns. It is the dish newcomers fall for first.'],
      ['A family recipe, guarded', 'Sarah learned both from her grandmother in Katong, and her rempah recipe stays firmly unwritten. “It lives in the hands,” she says. Those hands carry decades of refined skill no commercial kitchen can shortcut.'],
      '<strong>Hungry? <a href="/chef/sarah-tan">Book Chef Sarah Tan on Potluck →</a></strong> and taste a dish almost no restaurant still bothers to make — cooked in her own kitchen, just for you and your guests, an intimate home table you will not find anywhere else.',
    ]),
  },
  {
    title: 'Steamed Fish and Claypot Rice: Chef Mei Lin Wong’s Cantonese Kitchen',
    category: 'Chinese',
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'A delicately steamed soy-garlic fish and a smoky claypot rice — Chef Mei Lin Wong cooks restrained, precise Cantonese food in Chinatown.',
    tags: ['Steamed Fish', 'Claypot Rice', 'Cantonese', 'Chinatown', 'Chinese'],
    body: article([
      'Cantonese cooking is the art of doing less, perfectly. In Chinatown, <a href="/chef/mei-lin-wong">Chef Mei Lin Wong</a> proves it with a steamed fish so delicate it lives or dies by seconds on the heat.',
      ['Steamed soy garlic fish', 'Mei Lin steams her fish just until the flesh turns opaque, then finishes it with hot oil over ginger and spring onion and a drizzle of light soy. Over-steam it by a minute and it is ruined — which is exactly why precision is her pride.'],
      ['Claypot rice with crust', 'Her claypot rice is cooked over flame until the bottom forms that prized crackly golden crust, layered with lap cheong, chicken and a swirl of dark soy. She lets it rest off the heat so the crust sets before serving.'],
      ['Heat and timing', '“Cantonese food has nowhere to hide,” she says. “No heavy sauce to cover mistakes.” That honesty is what makes her cooking quietly impressive — the precision of years of practice you will not get from a busy restaurant line.'],
      '<strong>Hungry? <a href="/chef/mei-lin-wong">Book Chef Mei Lin Wong on Potluck →</a></strong> for Cantonese cooking with nothing to hide — cooked fresh in her own kitchen, just for you and your guests, an intimate home table no restaurant can offer.',
    ]),
  },
  {
    title: 'Mapo Tofu and Boiled Fish: The Fearless Sichuan of Chef Chen Wei',
    category: 'Chinese',
    featured: true,
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'Numbing peppercorns, chilli oil and serious heat — Chef Chen Wei brings unapologetic Sichuan cooking to Jurong East.',
    tags: ['Mapo Tofu', 'Sichuan', 'Chinese', 'Jurong East', 'Mala'],
    body: article([
      'Sichuan food is not shy, and neither is <a href="/chef/chen-wei">Chef Chen Wei</a>. In Jurong East he cooks the tongue-tingling, mala-forward dishes that made Sichuan famous — starting with a mapo tofu that earns its reputation.',
      ['Mapo tofu, properly numbing', 'Chen builds his mapo tofu on doubanjiang (fermented broad-bean chilli paste) and freshly ground Sichuan peppercorns, so it delivers the signature ma la — that numbing-then-spicy buzz. Silky tofu and minced pork carry the sauce.'],
      ['Boiled fish in chilli oil', 'His shui zhu yu looks alarming — a sea of red chilli oil — but the fish beneath is poached gently to silken tenderness. The oil is fragrant rather than merely hot, layered with garlic, ginger and a mountain of dried chilli.'],
      ['Heat with purpose', '“Mala is not about pain,” Chen insists. “It is about fragrance and depth.” Eat his food and you will understand the difference.'],
      'This is Sichuan cooking from his own family recipes, layered with a skill years of practice have refined — a depth no mass-market mala restaurant reaches. Cooked in his own kitchen and fired to order for you and your guests, it is an intimate home-dining experience, not a chain hotpot.',
      '<strong>Hungry? <a href="/chef/chen-wei">Book Chef Chen Wei on Potluck →</a></strong> if you can take the heat — and you should.',
    ]),
  },
  {
    title: 'Masala Dosai and Chettinad Chicken: Chef Raj Kumar’s South Indian Spread',
    category: 'Indian',
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'A crisp, golden dosai and a fiery Chettinad chicken — Chef Raj Kumar cooks bold South Indian food in Serangoon.',
    tags: ['Masala Dosai', 'Chettinad Chicken', 'South Indian', 'Serangoon', 'Indian'],
    body: article([
      'A great masala dosai is a small marvel of engineering — paper-thin, crisp, and wrapped around a spiced potato heart. In Serangoon, <a href="/chef/raj-kumar">Chef Raj Kumar</a> ferments his batter for two days to get the crackle and the gentle sour note right.',
      ['Masala dosai, crisp and golden', 'Raj spreads the batter thin on a screaming-hot griddle until it lacquers to gold, then folds it over a turmeric-yellow potato masala. Served with coconut chutney and a hot sambar, it is breakfast, lunch or supper.'],
      ['Chettinad chicken, fearless', 'His Chettinad chicken hails from Tamil Nadu’s spice country — a dark, intense curry built on roasted spices, black pepper and dried chilli. It is the dish for diners who think they like things hot.'],
      ['Spice ground fresh', 'Raj roasts and grinds his Chettinad masala to order, because, he says, “the smell of fresh-roasted spice is half the dish.”'],
      'That masala is a family recipe from Tamil Nadu’s spice country, ground with a skill years of practice have sharpened — a taste you will not find at any restaurant here. Cooked in his own kitchen and made to order for you and your guests, it is a personal home-dining experience rather than a counter plate.',
      '<strong>Hungry? <a href="/chef/raj-kumar">Book Chef Raj Kumar on Potluck →</a></strong> for South Indian cooking with real backbone.',
    ]),
  },

  // ---------------------------------------------------------------------------
  // More local-Singapore-cuisine lead magnets — each sells home cooking and a
  // chef's specialty, and links to /chef/{slug} at least twice.
  // ---------------------------------------------------------------------------
  {
    title: 'Nasi Ambeng: The Communal Malay Feast of Chef Ahmad Rahman',
    category: 'Malay',
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'A tray of rice ringed by a dozen dishes, meant to be shared by hand — Chef Ahmad Rahman cooks Geylang Serai’s most generous Malay feast.',
    tags: ['Nasi Ambeng', 'Mee Rebus', 'Malay', 'Geylang Serai', 'Halal'],
    body: article([
      'Nasi Ambeng is not a dish so much as an event: a heaped tray of rice surrounded by ayam, sambal goreng, serunding, bergedil and more, traditionally shared straight from one platter. In Geylang Serai, <a href="/chef/ahmad-rahman">Chef Ahmad Rahman</a> cooks it the kampung way — everything from scratch, nothing rushed.',
      ['Why home-cooked beats the shop', 'A home kitchen lets Ahmad fry his serunding (spiced coconut floss) low and slow until it turns deeply fragrant, and finish his sambal goreng the morning you eat it. No preservatives, no day-old warming trays — just food cooked to order the way his mother taught him.'],
      ['A recipe handed down', 'Ahmad’s nasi ambeng follows a closely-held recipe passed down three generations, each component balanced so the sweet, the spicy and the savoury land together on one mouthful — a refined harmony only years of practice achieve, and a taste no restaurant or stall can replicate. It is a feast designed for sharing, cooked just for you and your guests, which is exactly why it suits an intimate home table.'],
      ['Don’t skip the mee rebus', 'On the side he ladles out a mee rebus in thick, sweet-savoury sweet-potato gravy, crowned with egg, green chilli and lime — comforting, halal, and far cheaper than eating it out for a crowd.'],
      'Booking Ahmad means a feast for the whole family at a fraction of restaurant prices, cooked by someone who treats every tray like it is for his own kampung.',
      '<strong>Crave the real thing? <a href="/chef/ahmad-rahman">Book Chef Ahmad Rahman on Potluck →</a></strong> A nasi ambeng tray for sharing starts around SGD 15 a head.',
    ]),
  },
  {
    title: 'The Hainanese Pork Chop Most Stalls Forgot — Chef Daniel Lim Remembers',
    category: 'Singapore Hawker',
    image: IMG('photo-1617093727343-374698b1b08d'),
    excerpt: 'Crumbed, fried and napped in a tangy tomato-and-pea gravy — Chef Daniel Lim of Ang Mo Kio keeps an old kopitiam classic alive.',
    tags: ['Hainanese Pork Chop', 'Hainanese', 'Ang Mo Kio', 'Kopitiam', 'Heritage'],
    body: article([
      'Before fusion menus, Hainanese cooks in Singapore’s kopitiams were quietly inventing their own Western-meets-local classics. The Hainanese pork chop is the best of them, and in Ang Mo Kio <a href="/chef/daniel-lim">Chef Daniel Lim</a> still cooks it the proper way.',
      ['A dish you cannot buy fresh anymore', 'Few stalls bother with it now — the gravy takes time. Daniel makes his fresh: a tangy tomato sauce studded with peas and onions, poured over pork that is pounded thin, marinated, crumbed in cracker dust and fried to order. Cooked at home, it never sits soggy under a heat lamp.'],
      ['Why home cooking wins', 'No preservatives, no shortcut sauces from a packet. Daniel’s gravy is built from real tomatoes and stock, and the pork is fried the moment you are ready to eat — fresher and tastier than anything reheated, and gentler on the wallet than a restaurant.'],
      ['Pair it with the chicken rice', 'Order it alongside his famous Hainanese chicken rice and you taste two halves of the same heritage: the poached and the fried, the humble and the indulgent, both from a recipe his grandfather cooked decades ago.'],
      'It is the kind of dish that brings older diners straight back to childhood — and introduces younger ones to a Singapore they never knew. Cooked in his own kitchen with a skill decades in the making, and plated just for you and your guests, it is an intimate home table no food court can offer.',
      '<strong>Crave the real thing? <a href="/chef/daniel-lim">Book Chef Daniel Lim on Potluck →</a></strong> from around SGD 12 a plate.',
    ]),
  },
  {
    title: 'Mee Siam Done Slow: The Tamarind Gravy of Chef Roslan Bakar',
    category: 'Singapore Hawker',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'Bright with tamarind, gently spicy and topped with prawns and egg — Chef Roslan Bakar’s Tampines mee siam is worth slowing down for.',
    tags: ['Mee Siam', 'Local', 'Tampines', 'Tamarind', 'Halal'],
    body: article([
      'Mee siam looks simple until you taste a great one and realise how much is going on: sweet, sour, spicy and savoury all at once in a thin, fragrant gravy. In Tampines, <a href="/chef/roslan-bakar">Chef Roslan Bakar</a> builds his over a couple of patient hours.',
      ['The gravy is the whole dish', 'Roslan starts with a rempah of dried chilli, shallots and belacan, then loosens it with tamarind and a touch of taucu and fermented soy bean until the gravy turns tangy and slightly sweet. It bathes the bee hoon, topped with prawns, hard-boiled egg, tau pok and a squeeze of calamansi.'],
      ['Fresher, with no MSG shortcut', 'Cooked at home, his mee siam needs no flavour enhancers — the depth comes from real tamarind, real prawns and real time. That is the quiet advantage of home cooking: nothing hidden, everything fresh, and far kinder on your budget than a sit-down meal.'],
      ['A recipe from his mother', 'Roslan learned the balance from his mother, who insisted the gravy should never be thick. “If you can stand your spoon in it,” he laughs, “you have made laksa, not mee siam.”'],
      'It is a weekend-breakfast order if ever there was one, and it travels straight from his kitchen to your table — his mother’s recipe, refined over years, made to order just for you and your guests in a way no stall can match.',
      '<strong>Crave the real thing? <a href="/chef/roslan-bakar">Book Chef Roslan Bakar on Potluck →</a></strong> A mee siam plate starts around SGD 7.',
    ]),
  },
  {
    title: 'Chai Tow Kway, Black and White: The Carrot Cake of Chef Tan Boon Huat',
    category: 'Singapore Hawker',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'Soft radish cake, crisp edges and a wok-charred finish — Chef Tan Boon Huat fries fried carrot cake both ways in Hougang.',
    tags: ['Chai Tow Kway', 'Carrot Cake', 'Hawker', 'Hougang', 'Wok Hei'],
    body: article([
      'There is no carrot in carrot cake — it is fried radish cake, or chai tow kway, and getting it right is all about heat and timing. In Hougang, <a href="/chef/tan-boon-huat">Chef Tan Boon Huat</a> fries it the way the old hawkers did, in a screaming-hot wok, one plate at a time.',
      ['White versus black', 'White chai tow kway is savoury and soft, bound with egg and fish sauce and fried until the edges crisp. Black is sweet, glossed with dark sweet soy and caramelised at the corners. Boon Huat makes both, and most regulars order both.'],
      ['Steamed fresh, not shop-bought', 'He steams his own radish cake from rice flour and grated white radish — most stalls buy theirs in. That freshly made cake is softer inside and crisps better outside, and it is the difference you taste immediately. No preservatives, just rice flour and radish.'],
      ['Wok hei you can smell', 'The smoky “breath of the wok” only comes from cooking small batches over a fierce flame, finished the moment you sit down. Reheated carrot cake is a sad thing; his is fired to order, glossy and hot.'],
      'It is humble, cheap and deeply satisfying — proof that the best Singapore food is often the simplest, when someone with years of practice bothers to make it properly. Cooked in his own kitchen and fired just for you and your guests, it is an intimate plate you will not get reheated at any food court.',
      '<strong>Crave the real thing? <a href="/chef/tan-boon-huat">Book Chef Tan Boon Huat on Potluck →</a></strong> from about SGD 6 a plate.',
    ]),
  },
  {
    title: 'Orh Luak: The Crispy-Edged Oyster Omelette of Chef Goh Kim Hock',
    category: 'Singapore Hawker',
    image: IMG('photo-1617093727343-374698b1b08d'),
    excerpt: 'Shattering crisp edges, a soft centre and plump oysters — Chef Goh Kim Hock fries Toa Payoh’s old-school oyster omelette to order.',
    tags: ['Oyster Omelette', 'Orh Luak', 'Hokkien', 'Toa Payoh', 'Hawker'],
    body: article([
      'A great orh luak — oyster omelette — is a study in contrast: lacy, crisp edges giving way to a soft, starchy centre, with plump oysters hiding throughout. In Toa Payoh, <a href="/chef/goh-kim-hock">Chef Goh Kim Hock</a> has been frying it since the 1980s.',
      ['The starch-and-egg secret', 'Goh whisks sweet-potato starch into his egg so the omelette sets soft inside while the edges crackle in hot lard. The oysters go in late so they stay just-cooked and briny, never rubbery.'],
      ['Why home-fried beats the stall queue', 'Fried to order in small batches, his orh luak never loses its crunch sitting in a pile. There are no fillers and no day-old oysters — just fresh shellfish, egg and lard, cooked the minute you are ready. It is fresher, more generous with oysters, and easier on your wallet than a restaurant plate.'],
      ['A splash of vinegar-chilli', 'He finishes every plate with a tangy vinegar-chilli sauce that cuts the richness — the traditional partner that too many places leave out. Together it is the old Singapore you can taste.'],
      'Order it alongside his Hokkien prawn mee and you have a proper hawker spread, made at home with decades of practice — cooked just for you and your guests, an intimate table and a taste no stall queue delivers.',
      '<strong>Crave the real thing? <a href="/chef/goh-kim-hock">Book Chef Goh Kim Hock on Potluck →</a></strong> from around SGD 8.',
    ]),
  },
  {
    title: 'Bak Kut Teh, the Peppery Teochew Way — with Chef Wong Mui Keng',
    category: 'Chinese',
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'A clear, garlicky, white-pepper broth and fall-off-the-bone ribs — Chef Wong Mui Keng simmers Teochew bak kut teh in Bukit Merah.',
    tags: ['Bak Kut Teh', 'Teochew', 'Pork Ribs', 'Bukit Merah', 'Comfort Food'],
    body: article([
      'There are two camps in bak kut teh: the dark, herbal Hokkien style and the clear, peppery Teochew one. In Bukit Merah, <a href="/chef/wong-mui-keng">Chef Wong Mui Keng</a> firmly belongs to the second, simmering a broth so garlicky and pepper-forward it clears your head.',
      ['Broth built on time', 'Mui Keng simmers pork ribs with whole garlic cloves and a generous fist of white pepper until the meat slides off the bone and the soup turns milky-clear. No packet seasoning — the warmth comes entirely from pepper and good pork bones, slow-cooked the way her father did.'],
      ['Why fresh and home-cooked matters', 'A home-simmered bak kut teh has no MSG and no shortcut stock cubes — just bones, garlic and pepper given the hours they need. It is restorative in a way a rushed bowl never is, and a fraction of the price of eating out for the family.'],
      ['The full ritual', 'She serves it the proper Teochew way: with youtiao to dip, a saucer of dark soy and chopped chilli for the ribs, and refillable broth because, she insists, “the soup is the medicine.”'],
      'Pair it with her bak chor mee and you have a Teochew table that tastes like a Sunday at home — her father’s recipe, refined over years, cooked just for you and your guests in a way no restaurant chain can match.',
      '<strong>Crave the real thing? <a href="/chef/wong-mui-keng">Book Chef Wong Mui Keng on Potluck →</a></strong> A bak kut teh set starts around SGD 9.',
    ]),
  },
  {
    title: 'Nasi Briyani Ayam: The Dum-Steamed Rice of Chef Farah Ismail',
    category: 'Halal',
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'Golden basmati layered with spiced chicken and slow dum-steamed — Chef Farah Ismail perfumes a whole room from her Geylang Serai kitchen.',
    tags: ['Nasi Briyani', 'Indian-Muslim', 'Geylang Serai', 'Basmati', 'Halal'],
    body: article([
      'You can smell a real nasi briyani before you see it — saffron, cardamom, fried shallots and chicken mingling in the steam. In Geylang Serai, <a href="/chef/farah-ismail">Chef Farah Ismail</a> cooks hers the long way, dum-steaming rice and chicken together so the flavours marry.',
      ['Layered and sealed', 'Farah par-cooks fragrant basmati, layers it over marinated chicken, scatters fried onions and mint, then seals the pot and steams it low so every grain absorbs the spice. Shortcut versions just mix cooked rice with curry — hers is built in layers, the proper dum way.'],
      ['Fresh spice, no shortcuts', 'She toasts and grinds her own briyani masala, because pre-mixed powders, she says, taste flat. Cooked at home there are no preservatives and no food-court oiliness — just clean, fragrant rice and tender chicken, halal and made to order.'],
      ['A feast that stretches', 'One pot of Farah’s briyani feeds a crowd generously, which makes it far better value than ordering individual plates out. Add her dipping curry and acar and you have a celebration meal.'],
      'It is the dish she cooks for Hari Raya and weddings — and now, through Potluck, for your table any day of the year. This is her family’s briyani, refined over years, cooked just for you and your guests in a way no restaurant or food court can match.',
      '<strong>Crave the real thing? <a href="/chef/farah-ismail">Book Chef Farah Ismail on Potluck →</a></strong> A briyani ayam plate from around SGD 10.',
    ]),
  },
  {
    title: 'Satay Over Charcoal: The Patient Grilling of Chef Aminah Jalil',
    category: 'Halal',
    image: IMG('photo-1467003909585-2f8a72700288'),
    excerpt: 'Skewers charred at the edges, juicy within, and a thick peanut sauce made from scratch — Chef Aminah Jalil grills satay the slow way in Punggol.',
    tags: ['Satay', 'Halal', 'Punggol', 'Charcoal', 'Peanut Sauce'],
    body: article([
      'Satay is a dish of smoke and patience. Anyone can skewer chicken; few will fan a charcoal grill for an hour to get the edges right. In Punggol, <a href="/chef/aminah-jalil">Chef Aminah Jalil</a> does exactly that, turning each stick by hand.',
      ['Marinade with memory', 'Aminah marinates her chicken in turmeric, lemongrass, galangal and coriander overnight, so the spice soaks deep before the meat ever meets the coals. Grilled to order, the edges char while the centre stays juicy — never the dry, pre-grilled sticks you get reheated elsewhere.'],
      ['A peanut sauce worth the work', 'Her satay sauce is pounded from roasted peanuts, dried chilli and tamarind into something thick, nutty and gently sweet — a world away from the watery, sugary stuff. Made fresh at home, it has no preservatives and far more depth.'],
      ['The full set', 'She serves it the way it should be: with ketupat, cucumber and raw onion, all halal, all made for sharing around a table. It is cheaper than a barbecue restaurant and tastes of real charcoal, not a gas flame.'],
      'Order a hundred sticks for a gathering and watch them vanish — this is party food at its most communal, grilled in her own kitchen with a skill years in the making, from a marinade and sauce no satay restaurant can copy, and made just for you and your guests.',
      '<strong>Crave the real thing? <a href="/chef/aminah-jalil">Book Chef Aminah Jalil on Potluck →</a></strong> Satay from around SGD 0.80 a stick.',
    ]),
  },
  {
    title: 'Laksa Lemak: The Coconut Gravy of Chef Sarah Tan’s Tiong Bahru Kitchen',
    category: 'Peranakan',
    image: IMG('photo-1577219491135-ce391730fb2c'),
    excerpt: 'A rich coconut-and-prawn gravy fragrant with laksa leaf, poured over thick noodles and cockles — Chef Sarah Tan’s laksa is the dish newcomers fall for.',
    tags: ['Laksa', 'Peranakan', 'Tiong Bahru', 'Coconut', 'Nyonya'],
    body: article([
      'If buah keluak is the Peranakan dish for connoisseurs, laksa lemak is the one everyone falls for first. In Tiong Bahru, <a href="/chef/sarah-tan">Chef Sarah Tan</a> cooks a laksa so fragrant it announces itself from the doorway.',
      ['The rempah does the work', 'Sarah pounds her own laksa rempah — dried chilli, candlenut, lemongrass, galangal and belacan — and fries it patiently before loosening it with prawn stock and coconut milk. That hand-pounded paste, she says, is why a blender version never quite sings.'],
      ['Why home-cooked tastes richer', 'Her gravy uses real santan and a stock simmered from prawn shells, with no thickeners or instant paste. Cooked fresh, it has a roundness and aroma that packet laksa cannot touch — and it is gentler on the wallet than a sit-down bowl.'],
      ['Topped the Katong way', 'She finishes it with thick rice noodles, plump prawns, cockles, tau pok and a spoon of sambal, scattered with chopped laksa leaf. It is the Katong laksa of her childhood, cooked the slow way.'],
      'Pair it with her ayam buah keluak and you taste the full range of Nyonya cooking — the approachable and the legendary, side by side. It is her grandmother’s rempah, refined over years, cooked in her own kitchen just for you and your guests — an intimate home table no restaurant can replicate.',
      '<strong>Crave the real thing? <a href="/chef/sarah-tan">Book Chef Sarah Tan on Potluck →</a></strong> A bowl of laksa lemak from around SGD 9.',
    ]),
  },
  {
    title: 'Nyonya Chap Chye: The Humble Heritage Dish of Chef Evelyn Koh',
    category: 'Peranakan',
    image: IMG('photo-1604908176997-125f25cc6f3d'),
    excerpt: 'Cabbage, lily buds and glass noodles braised in prawn stock and tau cheo — Chef Evelyn Koh turns a vegetable stew into something soulful in Katong.',
    tags: ['Chap Chye', 'Nyonya Kueh', 'Peranakan', 'Katong', 'Heritage'],
    body: article([
      'Nyonya chap chye looks like a modest mixed-vegetable stew, but a good one is anything but. In Katong, <a href="/chef/evelyn-koh">Chef Evelyn Koh</a> braises hers until it tastes far greater than the sum of its parts.',
      ['Braised, not boiled', 'Evelyn softens cabbage, black fungus, dried lily buds and glass noodles in a prawn-and-pork stock seasoned with fermented soybean paste (tau cheo). The long, gentle braise melts everything into a savoury, faintly sweet tangle that soaks up rice beautifully.'],
      ['The case for cooking it at home', 'This is a dish of time, not expensive ingredients — exactly the sort of thing restaurants stopped making. Cooked fresh at home it carries no preservatives and far more depth, and it stretches generously for a family meal at little cost.'],
      ['A dish almost lost', '“Young people don’t cook chap chye anymore — too slow,” Evelyn says. “So I keep cooking it, so they remember how it should taste.” Each booking is a small act of preservation.'],
      'Order it with her babi pongteh and you have a Peranakan spread that tastes of a Katong shophouse kitchen — her family’s recipes, refined over years, cooked in her own kitchen just for you and your guests, an intimate table few restaurants still offer.',
      '<strong>Crave the real thing? <a href="/chef/evelyn-koh">Book Chef Evelyn Koh on Potluck →</a></strong> A heritage Nyonya spread starts around SGD 12 a head.',
    ]),
  },
  {
    title: 'Curry Fish Head, Built for Sharing — with Chef Kadir Hussain',
    category: 'Indian',
    image: IMG('photo-1588166524941-3bf61a9c41db'),
    excerpt: 'A tamarind-bright, lip-tingling gravy around a generous red snapper head — Chef Kadir Hussain’s Little India fish head curry is made for a long, loud table.',
    tags: ['Fish Head Curry', 'Indian-Muslim', 'Little India', 'Tamarind', 'Sharing'],
    body: article([
      'Fish head curry is Singapore on a plate — a Tamil dish embraced by every community, best eaten elbow to elbow over rice. In Little India, <a href="/chef/kadir-hussain">Chef Kadir Hussain</a> simmers one that pulls a crowd.',
      ['A gravy that tingles', 'Kadir builds his curry on a base of toasted spices, curry leaf and tamarind, bright and sour with just enough chilli to make your lips buzz. Okra and brinjal go in to soak up the gravy, around a fresh red snapper head that gives the dish its richness.'],
      ['Fresh fish, fresh spice, no shortcuts', 'He buys the fish the morning he cooks and grinds his own masala — pre-ground powder, he insists, has already lost its soul. Cooked at home there are no preservatives and no watered-down food-court gravy, and one pot feeds a whole table for far less than a restaurant.'],
      ['Made for a crowd', 'This is communal food by design. Gather a few friends, pile on the rice, and pass the gravy around — it is cheaper, fresher and far more fun than queuing for a table.'],
      'Order it with his mutton murtabak and you have a Little India feast at your own dining table — his own family masala, ground with a skill years in the making, cooked just for you and your guests in a way no restaurant gravy can match.',
      '<strong>Crave the real thing? <a href="/chef/kadir-hussain">Book Chef Kadir Hussain on Potluck →</a></strong> A sharing fish head curry from around SGD 25.',
    ]),
  },
  {
    title: 'Idli and Sambar Before Sunrise: Chef Meera Pillai’s Vegetarian Breakfast',
    category: 'Vegetarian',
    image: IMG('photo-1546833999-b9f581a1996d'),
    excerpt: 'Steamed rice cakes soft as clouds and a tamarind-bright sambar — Chef Meera Pillai cooks a South Indian breakfast worth waking for in Queenstown.',
    tags: ['Idli Sambar', 'South Indian', 'Vegetarian', 'Queenstown', 'Breakfast'],
    body: article([
      'A plate of idli and sambar is one of the great vegetarian breakfasts of the world — light, nourishing and deeply comforting. In Queenstown, <a href="/chef/meera-pillai">Chef Meera Pillai</a> makes hers entirely from scratch, starting the night before.',
      ['Fermentation you can taste', 'Meera grinds and ferments her batter overnight so the idli steam up soft, fluffy and faintly sour — never the dense, shop-bought kind. That live fermentation is gentle on the stomach and impossible to fake with a packet mix.'],
      ['A sambar with backbone', 'Her sambar simmers toor dal with tamarind, drumstick, curry leaf and a freshly bloomed tadka of mustard seed and asafoetida. There are no stock cubes or preservatives — just dal, vegetables and spice, cooked the way her mother did in Tamil Nadu.'],
      ['Why home-cooked is better and cheaper', 'A fresh, meat-free breakfast like this is healthier and far kinder on the wallet than eating out, and Meera will happily cook for vegetarian, vegan and Jain diners alike. Inclusive food is the whole point, she says.'],
      'Add her coconut chutney and you have a breakfast that sets up the whole day — proof that vegetarian eating is never a compromise. It is her mother’s recipe, refined over years, cooked in her own kitchen just for you and your guests, a taste no restaurant breakfast counter delivers.',
      '<strong>Crave the real thing? <a href="/chef/meera-pillai">Book Chef Meera Pillai on Potluck →</a></strong> A South Indian breakfast set from around SGD 8.',
    ]),
  },
  {
    title: 'Kaya Toast and Soft-Boiled Eggs: The Kopitiam Breakfast of Chef Lim Ah Seng',
    category: 'Singapore Hawker',
    image: IMG('photo-1556910103-1c02745aae4d'),
    excerpt: 'Charcoal-toasted bread, cold butter and house-made pandan kaya — Chef Lim Ah Seng serves the kopitiam breakfast Singapore is quietly losing, in Bishan.',
    tags: ['Kaya Toast', 'Soft-Boiled Eggs', 'Kopitiam', 'Bishan', 'Breakfast'],
    body: article([
      'The kaya toast set is the most Singaporean of breakfasts, and the hardest to find done well. In Bishan, <a href="/chef/lim-ah-seng">Chef Lim Ah Seng</a> still makes his the old way — kaya stirred by hand, bread toasted over charcoal, eggs cracked to order.',
      ['Kaya from scratch', 'Ah Seng cooks his pandan kaya low and slow from coconut milk, eggs, sugar and pandan leaf — no green colouring, no preservatives, just a fragrant green-gold spread you cannot buy in a jar. The difference between homemade and shop-bought kaya, he says, is the difference between the dish and an impostor.'],
      ['Charcoal toast and just-set eggs', 'He toasts thick bread over coals so the edges char and the centre stays soft, slips in a slab of cold butter, then serves two eggs cooked just past runny with dark soy and white pepper. Made to order, never sitting warm — that freshness is the whole appeal.'],
      ['Cheaper, slower, better', 'A home-cooked kopitiam set costs a fraction of a café brunch and tastes of an older Singapore. “People want fast food fast,” Ah Seng says. “I want them to sit down properly.”'],
      'Order it with a kopi and you have a weekend morning worth waking up for — his own kaya recipe, refined over years, cooked just for you and your guests, an intimate table and a taste no café or food court can copy.',
      '<strong>Crave the real thing? <a href="/chef/lim-ah-seng">Book Chef Lim Ah Seng on Potluck →</a></strong> A kaya toast breakfast set from around SGD 6.',
    ]),
  },
  {
    title: 'Claypot Rice with the Crust: The Cantonese Comfort of Chef Mei Lin Wong',
    category: 'Chinese',
    image: IMG('photo-1516684732162-798a0062be99'),
    excerpt: 'Smoky, crackly-bottomed rice layered with lap cheong and chicken — Chef Mei Lin Wong cooks claypot rice over flame in Chinatown.',
    tags: ['Claypot Rice', 'Cantonese', 'Chinatown', 'Lap Cheong', 'Comfort Food'],
    body: article([
      'A proper claypot rice is theatre and comfort at once — the lid lifts to a cloud of steam, dark soy, and the smell of rice crisping against hot clay. In Chinatown, <a href="/chef/mei-lin-wong">Chef Mei Lin Wong</a> cooks hers over open flame, never a rice cooker.',
      ['The crust is the prize', 'Mei Lin cooks the rice in a seasoned claypot until the bottom forms the prized golden crust — the “faan ziu” regulars fight over. It only happens over a real flame, with patience, and she lets the pot rest off the heat so the crust sets before serving.'],
      ['Layered while it steams', 'Lap cheong, marinated chicken, ginger and a swirl of dark sweet soy go in to cook with the rice, so every grain carries the flavour. Cooked fresh to order at home, there are no preservatives and no reheated stodge — just rice, sausage and chicken, fired the minute you sit down.'],
      ['Comfort that costs little', 'One claypot feeds a small family generously and far more cheaply than eating out. It is the unfussy, soul-warming Cantonese food Mei Lin grew up on, made the slow way it deserves.'],
      'Order it with her steamed fish and you have a Cantonese home dinner with nothing to hide — cooked in her own kitchen with a skill years of practice have refined, just for you and your guests, an intimate table no restaurant can replicate.',
      '<strong>Crave the real thing? <a href="/chef/mei-lin-wong">Book Chef Mei Lin Wong on Potluck →</a></strong> A claypot rice from around SGD 10.',
    ]),
  },
];

async function main() {
  await ensureSchema();

  // Categories
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await db
      .insert(blogCategories)
      .values({ name: c.name, slug: slugify(c.name), description: c.description, displayOrder: i })
      .onConflictDoNothing({ target: blogCategories.slug });
  }
  const cats = await db.select().from(blogCategories);
  const catBySlug = new Map(cats.map((c) => [c.slug, c.id]));
  console.log(`Categories ready: ${cats.length}`);

  // Posts — UPSERT so existing rows sync to the latest content/tags/SEO too, keeping the
  // live like/view counts (and original publishedAt) intact. This is what makes localhost
  // and the remote DB end up identical from a single `seed:blog` run.
  const now = Date.now();
  let count = 0;
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i];
    const slug = slugify(p.title);
    const publishedAt = new Date(now - i * 3 * 24 * 60 * 60 * 1000); // stagger ~3 days apart
    const categoryId = catBySlug.get(slugify(p.category)) ?? null;
    const seoKeywords = `${p.category}, home dining, Singapore, Potluck`;
    const readingTime = estimateReadingTime(p.body);
    await db
      .insert(blogPosts)
      .values({
        title: p.title,
        slug,
        excerpt: p.excerpt,
        contentHtml: p.body,
        featuredImage: p.image,
        categoryId,
        authorName: 'Potluck Team',
        status: 'published',
        featured: p.featured ?? false,
        readingTime,
        likeCount: 10 + ((i * 137 + 71) % 291),
        viewCount: 120 + ((i * 219 + 33) % 4200),
        seoTitle: p.title,
        seoDescription: p.excerpt,
        seoKeywords,
        tags: p.tags ?? [],
        publishedAt,
      })
      .onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          // Content/SEO/tags re-synced on every run; likeCount/viewCount/publishedAt
          // are intentionally NOT in `set`, so real engagement is preserved.
          title: p.title,
          excerpt: p.excerpt,
          contentHtml: p.body,
          featuredImage: p.image,
          categoryId,
          status: 'published',
          featured: p.featured ?? false,
          readingTime,
          seoTitle: p.title,
          seoDescription: p.excerpt,
          seoKeywords,
          tags: p.tags ?? [],
          updatedAt: new Date(),
        },
      });
    count++;
  }
  console.log(`Posts upserted: ${count} (new inserted + existing updated to latest content/tags)`);
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
