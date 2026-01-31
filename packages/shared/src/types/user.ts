export type UserRole = 'customer' | 'chef' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithChefProfile extends User {
  chefProfile: ChefProfile | null;
}

export interface ChefProfile {
  id: string;
  userId: string;
  bio: string | null;
  specialties: string[];

  // Address
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;

  // Social Links
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;

  // Stripe Connect
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;

  // Ratings
  averageRating: number;
  totalReviews: number;

  // Status
  isVerified: boolean;
  isAvailable: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface PublicChefProfile
  extends Pick<
    ChefProfile,
    | 'id'
    | 'bio'
    | 'specialties'
    | 'city'
    | 'latitude'
    | 'longitude'
    | 'instagramUrl'
    | 'facebookUrl'
    | 'tiktokUrl'
    | 'websiteUrl'
    | 'averageRating'
    | 'totalReviews'
    | 'isVerified'
    | 'isAvailable'
  > {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}
