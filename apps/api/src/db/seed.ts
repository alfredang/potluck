import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { FOOD_CATEGORIES } from '@homechef/shared';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed menu categories
  console.log('Creating menu categories...');
  const categoryIds: Record<string, string> = {};
  for (const category of FOOD_CATEGORIES) {
    const [inserted] = await db
      .insert(schema.menuCategories)
      .values({
        name: category.name,
        slug: category.slug,
        description: `Delicious ${category.name} cuisine`,
        displayOrder: FOOD_CATEGORIES.indexOf(category),
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) {
      categoryIds[category.slug] = inserted.id;
    }
  }

  // Fetch existing categories if they weren't inserted
  const existingCategories = await db.select().from(schema.menuCategories);
  for (const cat of existingCategories) {
    categoryIds[cat.slug] = cat.id;
  }

  // Seed sample users (chefs)
  console.log('Creating sample users...');
  const sampleUsers = [
    { email: 'sarah.tan@example.com', firstName: 'Sarah', lastName: 'Tan', role: 'chef' as const },
    { email: 'ahmad.rahman@example.com', firstName: 'Ahmad', lastName: 'Rahman', role: 'chef' as const },
    { email: 'maria.santos@example.com', firstName: 'Maria', lastName: 'Santos', role: 'chef' as const },
    { email: 'kenji.yamamoto@example.com', firstName: 'Kenji', lastName: 'Yamamoto', role: 'chef' as const },
    { email: 'priya.sharma@example.com', firstName: 'Priya', lastName: 'Sharma', role: 'chef' as const },
    { email: 'kim.sooyoung@example.com', firstName: 'Soo-young', lastName: 'Kim', role: 'chef' as const },
  ];

  const userIds: string[] = [];
  for (const user of sampleUsers) {
    const [inserted] = await db
      .insert(schema.users)
      .values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: true,
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) {
      userIds.push(inserted.id);
    }
  }

  // Fetch existing users if needed
  if (userIds.length === 0) {
    const existingUsers = await db.select().from(schema.users).where(schema.users.role.equals('chef'));
    for (const user of existingUsers) {
      userIds.push(user.id);
    }
  }

  // Seed chef profiles
  console.log('Creating chef profiles...');
  const chefProfiles = [
    { userId: userIds[0], bio: 'Passionate Peranakan chef with 15 years of experience cooking traditional Nyonya recipes passed down from my grandmother.', specialties: ['Peranakan', 'Nyonya'], city: 'Tiong Bahru', postalCode: '168732' },
    { userId: userIds[1], bio: 'Serving authentic Malay cuisine made with love and traditional spices. Halal certified kitchen.', specialties: ['Malay', 'Halal'], city: 'Geylang Serai', postalCode: '409050' },
    { userId: userIds[2], bio: 'Bringing the flavors of the Philippines to Singapore. Specializing in homestyle Filipino comfort food.', specialties: ['Filipino', 'Asian Fusion'], city: 'Toa Payoh', postalCode: '310123' },
    { userId: userIds[3], bio: 'Trained in Tokyo, now sharing authentic Japanese cuisine. Specializing in omakase-style home dining experiences.', specialties: ['Japanese', 'Sushi', 'Omakase'], city: 'Robertson Quay', postalCode: '238839' },
    { userId: userIds[4], bio: 'Vegetarian Indian chef offering a journey through the diverse flavors of India. All dishes prepared fresh with authentic spices.', specialties: ['Indian', 'Vegetarian'], city: 'Little India', postalCode: '218224' },
    { userId: userIds[5], bio: 'Korean home chef specializing in traditional Korean BBQ and homemade banchan. Family recipes from Seoul.', specialties: ['Korean', 'BBQ'], city: 'Tanjong Pagar', postalCode: '078867' },
  ];

  const chefIds: string[] = [];
  for (let i = 0; i < chefProfiles.length && i < userIds.length; i++) {
    const profile = chefProfiles[i];
    const [inserted] = await db
      .insert(schema.chefProfiles)
      .values({
        userId: profile.userId,
        bio: profile.bio,
        specialties: profile.specialties,
        city: profile.city,
        postalCode: profile.postalCode,
        country: 'Singapore',
        isVerified: true,
        isAvailable: true,
        averageRating: (4.5 + Math.random() * 0.5).toFixed(2),
        totalReviews: Math.floor(50 + Math.random() * 100),
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) {
      chefIds.push(inserted.id);
    }
  }

  // Fetch existing chef profiles if needed
  if (chefIds.length === 0) {
    const existingChefs = await db.select().from(schema.chefProfiles);
    for (const chef of existingChefs) {
      chefIds.push(chef.id);
    }
  }

  // Seed sample menus
  console.log('Creating sample menus...');
  const sampleMenus = [
    { chefIdx: 0, categorySlug: 'chinese', name: 'Ayam Buah Keluak', description: 'Traditional Peranakan chicken stew with black nuts, a signature Nyonya dish.', price: 4500, isVegetarian: false },
    { chefIdx: 0, categorySlug: 'chinese', name: 'Laksa Lemak', description: 'Rich and creamy coconut curry noodle soup with prawns and fish cake.', price: 3500, isVegetarian: false },
    { chefIdx: 1, categorySlug: 'malay', name: 'Nasi Ambeng Set', description: 'Traditional Javanese rice platter with beef rendang, sambal goreng, and more.', price: 4000, isVegetarian: false },
    { chefIdx: 1, categorySlug: 'halal', name: 'Mee Rebus', description: 'Yellow noodles in thick, spicy gravy topped with egg, tofu, and lime.', price: 2800, isVegetarian: false },
    { chefIdx: 2, categorySlug: 'western', name: 'Lechon Kawali', description: 'Crispy deep-fried pork belly served with liver sauce.', price: 3800, isVegetarian: false },
    { chefIdx: 2, categorySlug: 'western', name: 'Kare-Kare', description: 'Rich oxtail stew in peanut sauce with vegetables.', price: 4200, isVegetarian: false },
    { chefIdx: 3, categorySlug: 'japanese', name: 'Omakase Set (8 course)', description: 'Chef\'s selection of seasonal sashimi, nigiri, and specialty dishes.', price: 12000, isVegetarian: false },
    { chefIdx: 3, categorySlug: 'japanese', name: 'Chirashi Don', description: 'Assorted premium sashimi over seasoned sushi rice.', price: 6500, isVegetarian: false },
    { chefIdx: 4, categorySlug: 'indian', name: 'Thali Set (Vegetarian)', description: 'Complete meal with dal, sabzi, rice, roti, raita, and dessert.', price: 3500, isVegetarian: true },
    { chefIdx: 4, categorySlug: 'vegetarian', name: 'Paneer Tikka Masala', description: 'Marinated cottage cheese in rich tomato-cream curry.', price: 2800, isVegetarian: true },
    { chefIdx: 5, categorySlug: 'korean', name: 'Korean BBQ Set (2 pax)', description: 'Premium beef bulgogi, samgyeopsal, and all the banchan.', price: 9000, isVegetarian: false },
    { chefIdx: 5, categorySlug: 'korean', name: 'Budae Jjigae', description: 'Army stew with kimchi, tofu, noodles, and assorted meats.', price: 3200, isVegetarian: false },
  ];

  for (const menu of sampleMenus) {
    if (chefIds[menu.chefIdx] && categoryIds[menu.categorySlug]) {
      await db
        .insert(schema.menus)
        .values({
          chefId: chefIds[menu.chefIdx],
          categoryId: categoryIds[menu.categorySlug],
          name: menu.name,
          description: menu.description,
          price: menu.price,
          currency: 'SGD',
          isVegetarian: menu.isVegetarian,
          isAvailable: true,
          preparationTime: 60 + Math.floor(Math.random() * 60),
        })
        .onConflictDoNothing();
    }
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
