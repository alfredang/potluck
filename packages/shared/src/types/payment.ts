export type PaymentStatus = 'pending' | 'held' | 'released' | 'refunded' | 'failed';

export interface Payment {
  id: string;
  bookingId: string;

  // Stripe references
  stripePaymentIntentId: string | null;
  stripeTransferId: string | null;

  // Amounts (in SGD cents)
  amount: number;
  platformFee: number;
  chefPayout: number;
  currency: string;

  // Status
  status: PaymentStatus;

  // Escrow management
  capturedAt: Date | null;
  releaseScheduledAt: Date | null;
  releasedAt: Date | null;
  refundedAt: Date | null;

  // Metadata
  paymentMethod: string | null;
  last4: string | null;
  cardBrand: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'unlimited';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number; // in SGD (0 for free)
  maxMenus: number; // -1 for unlimited
  features: string[];
}

export interface Subscription {
  id: string;
  chefId: string;
  tier: SubscriptionTier;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;

  maxMenus: number;

  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;

  status: 'active' | 'canceled' | 'past_due';

  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  stripeInvoiceId: string | null;
  amount: number; // in SGD cents
  currency: string;
  status: 'paid' | 'failed' | 'pending';
  paidAt: Date | null;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
}
