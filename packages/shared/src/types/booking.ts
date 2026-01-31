export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface ChefAvailability {
  id: string;
  chefId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  maxBookings: number;
  currentBookings: number;
  isAvailable: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  bookingNumber: string;

  customerId: string;
  chefId: string;
  menuId: string;
  availabilitySlotId: string | null;

  // Booking details
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  guestCount: number;
  specialInstructions: string | null;

  // Pricing (in SGD cents)
  menuPrice: number;
  subtotal: number;
  platformFee: number; // 4%
  total: number;

  // Status tracking
  status: BookingStatus;
  confirmedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;

  // T&C acceptance
  termsAcceptedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDetails extends Booking {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
  chef: {
    id: string;
    userId: string;
    stripeAccountId: string | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
  menu: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}
