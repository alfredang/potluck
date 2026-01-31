export type FoodCategory =
  | 'chinese'
  | 'western'
  | 'thai'
  | 'japanese'
  | 'korean'
  | 'malay'
  | 'indian'
  | 'halal'
  | 'vegetarian';

export interface MenuCategory {
  id: string;
  name: string;
  slug: FoodCategory;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Menu {
  id: string;
  chefId: string;
  categoryId: string;

  name: string;
  description: string | null;
  price: number; // in SGD cents
  currency: string;

  // Images
  images: string[];

  // Dietary info
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];

  // Serving info
  servingSize: string | null;
  preparationTime: number | null; // in minutes

  // Status
  isAvailable: boolean;
  isFeatured: boolean;

  // Stats
  totalOrders: number;
  averageRating: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface MenuWithCategory extends Menu {
  category: MenuCategory;
}

export interface MenuWithChef extends MenuWithCategory {
  chef: {
    id: string;
    userId: string;
    averageRating: number;
    totalReviews: number;
    isVerified: boolean;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}
