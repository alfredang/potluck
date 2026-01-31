export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  chefId: string;
  menuId: string;

  rating: number; // 1-5
  title: string | null;
  comment: string | null;

  // Chef response
  chefResponse: string | null;
  chefRespondedAt: Date | null;

  isVerifiedPurchase: boolean;
  isVisible: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithDetails extends Review {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  menu: {
    id: string;
    name: string;
    images: string[];
  };
}

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';

export interface Dispute {
  id: string;
  bookingId: string;
  raisedById: string;

  reason: string;
  description: string;

  status: DisputeStatus;
  resolution: string | null;
  resolvedById: string | null;
  resolvedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
