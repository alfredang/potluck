/**
 * Seeds blog categories + posts. Idempotent (skips existing slugs).
 * Run: pnpm --filter @homechef/web seed:blog
 */
import { sql, eq } from 'drizzle-orm';
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
    published_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`);
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
};

const POSTS: Seed[] = [
  {
    title: 'How Potluck Brings Home Chefs and Food Lovers Together',
    category: 'Home Dining Tips',
    featured: true,
    image: IMG('photo-1556910103-1c02745aae4d'),
    excerpt: 'A look at how Potluck connects talented home cooks in Singapore with neighbours hungry for an authentic, home-cooked meal.',
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
    body: article([
      'We sat down with a chef three months into her Potluck journey to hear how it has gone.',
      ['On nerves', '“I was terrified before my first booking. Then the guests walked in, smelled the food, and the nerves vanished.”'],
      ['On community', '“Some guests have become regulars. One even brought me a plant for my kitchen. It feels like making friends.”'],
      'Thinking of hosting? Her advice: “Start with one dish you love. The rest follows.”',
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

  // Posts
  const now = Date.now();
  let created = 0;
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i];
    const slug = slugify(p.title);
    const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug));
    if (existing) continue;
    const publishedAt = new Date(now - i * 3 * 24 * 60 * 60 * 1000); // stagger ~3 days apart
    await db.insert(blogPosts).values({
      title: p.title,
      slug,
      excerpt: p.excerpt,
      contentHtml: p.body,
      featuredImage: p.image,
      categoryId: catBySlug.get(slugify(p.category)) ?? null,
      authorName: 'Potluck Team',
      status: 'published',
      featured: p.featured ?? false,
      readingTime: estimateReadingTime(p.body),
      likeCount: Math.floor(5 + (i * 7) % 40),
      viewCount: Math.floor(80 + (i * 53) % 400),
      seoTitle: p.title,
      seoDescription: p.excerpt,
      seoKeywords: `${p.category}, home dining, Singapore, Potluck`,
      publishedAt,
    });
    created++;
  }
  console.log(`Posts created: ${created} (skipped ${POSTS.length - created} existing)`);
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
