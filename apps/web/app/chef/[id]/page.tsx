'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Sample chef data (will be replaced with database query)
const sampleChefs: Record<string, {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  bio: string;
  cuisines: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  menus: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVegetarian: boolean;
    prepTime: number;
  }>;
}> = {
  '1': {
    id: '1',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    rating: 4.9,
    reviewCount: 127,
    location: 'Tiong Bahru, Singapore',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800',
    bio: 'Passionate Peranakan chef with 15 years of experience cooking traditional Nyonya recipes passed down from my grandmother. I believe in preserving the authentic flavors of Peranakan cuisine while adding my own modern touch.',
    cuisines: ['Peranakan', 'Nyonya', 'Chinese'],
    socialMedia: {
      instagram: 'chefsarahtan',
      facebook: 'chefsarahtan',
      tiktok: 'chefsarahtan',
      youtube: 'chefsarahtan',
    },
    menus: [
      { id: 'm1', name: 'Ayam Buah Keluak', description: 'Traditional Peranakan chicken stew with black nuts, a signature Nyonya dish that takes hours to prepare.', price: 4500, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', isVegetarian: false, prepTime: 120 },
      { id: 'm2', name: 'Laksa Lemak', description: 'Rich and creamy coconut curry noodle soup with prawns, fish cake, and all the traditional toppings.', price: 3500, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isVegetarian: false, prepTime: 60 },
      { id: 'm3', name: 'Kueh Pie Tee', description: 'Crispy pastry shells filled with spiced turnip and prawns. A beloved Peranakan appetizer.', price: 2000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', isVegetarian: false, prepTime: 45 },
    ],
  },
  '2': {
    id: '2',
    name: 'Chef Ahmad Rahman',
    specialty: 'Malay',
    rating: 4.8,
    reviewCount: 89,
    location: 'Geylang Serai, Singapore',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    bio: 'Serving authentic Malay cuisine made with love and traditional spices. My kitchen is halal certified and I specialize in traditional Malay dishes from my hometown.',
    cuisines: ['Malay', 'Halal', 'Indonesian'],
    socialMedia: {
      instagram: 'chefahmad',
      facebook: 'chefahmadrahman',
      tiktok: 'chefahmad',
    },
    menus: [
      { id: 'm4', name: 'Nasi Ambeng Set', description: 'Traditional Javanese rice platter with beef rendang, sambal goreng, bergedel, and more.', price: 4000, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isVegetarian: false, prepTime: 90 },
      { id: 'm5', name: 'Mee Rebus', description: 'Yellow noodles in thick, spicy gravy topped with egg, tofu, lime, and crispy shallots.', price: 2800, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', isVegetarian: false, prepTime: 45 },
    ],
  },
  '3': {
    id: '3',
    name: 'Chef Maria Santos',
    specialty: 'Filipino',
    rating: 4.7,
    reviewCount: 64,
    location: 'Toa Payoh, Singapore',
    image: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=800',
    bio: 'Bringing the flavors of the Philippines to Singapore. I specialize in homestyle Filipino comfort food that reminds you of home.',
    cuisines: ['Filipino', 'Asian Fusion'],
    socialMedia: {
      instagram: 'chefmariasantos',
      facebook: 'chefmariasantos',
      youtube: 'chefmariasantos',
    },
    menus: [
      { id: 'm6', name: 'Lechon Kawali', description: 'Crispy deep-fried pork belly served with homemade liver sauce.', price: 3800, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', isVegetarian: false, prepTime: 75 },
      { id: 'm7', name: 'Kare-Kare', description: 'Rich oxtail stew in peanut sauce with vegetables and shrimp paste.', price: 4200, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isVegetarian: false, prepTime: 120 },
    ],
  },
  '4': {
    id: '4',
    name: 'Chef Kenji Yamamoto',
    specialty: 'Japanese',
    rating: 4.9,
    reviewCount: 156,
    location: 'Robertson Quay, Singapore',
    image: 'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?w=800',
    bio: 'Trained in Tokyo for 10 years, now sharing authentic Japanese cuisine in Singapore. I specialize in omakase-style home dining experiences.',
    cuisines: ['Japanese', 'Sushi', 'Omakase'],
    socialMedia: {
      instagram: 'chefkenji',
      youtube: 'chefkenjiyamamoto',
      tiktok: 'chefkenji',
    },
    menus: [
      { id: 'm8', name: 'Omakase Set (8 course)', description: "Chef's selection of seasonal sashimi, nigiri, and specialty dishes.", price: 12000, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', isVegetarian: false, prepTime: 90 },
      { id: 'm9', name: 'Chirashi Don', description: 'Assorted premium sashimi over seasoned sushi rice.', price: 6500, image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400', isVegetarian: false, prepTime: 30 },
    ],
  },
  '5': {
    id: '5',
    name: 'Chef Priya Sharma',
    specialty: 'Indian',
    rating: 4.8,
    reviewCount: 103,
    location: 'Little India, Singapore',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800',
    bio: 'Vegetarian Indian chef offering a journey through the diverse flavors of India. All dishes are prepared fresh with authentic spices imported from India.',
    cuisines: ['Indian', 'Vegetarian', 'Vegan-friendly'],
    socialMedia: {
      instagram: 'chefpriyasharma',
      facebook: 'chefpriyasharma',
      youtube: 'chefpriyacooks',
    },
    menus: [
      { id: 'm10', name: 'Thali Set (Vegetarian)', description: 'Complete meal with dal, sabzi, rice, roti, raita, and dessert.', price: 3500, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', isVegetarian: true, prepTime: 60 },
      { id: 'm11', name: 'Paneer Tikka Masala', description: 'Marinated cottage cheese in rich tomato-cream curry with naan.', price: 2800, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', isVegetarian: true, prepTime: 45 },
    ],
  },
  '6': {
    id: '6',
    name: 'Chef Kim Soo-young',
    specialty: 'Korean',
    rating: 4.7,
    reviewCount: 78,
    location: 'Tanjong Pagar, Singapore',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800',
    bio: 'Korean home chef specializing in traditional Korean BBQ and homemade banchan. Family recipes passed down from my grandmother in Seoul.',
    cuisines: ['Korean', 'BBQ', 'Asian'],
    socialMedia: {
      instagram: 'chefkimsy',
      tiktok: 'chefkimsy',
      facebook: 'chefkimsooyoung',
    },
    menus: [
      { id: 'm12', name: 'Korean BBQ Set (2 pax)', description: 'Premium beef bulgogi, samgyeopsal, and all the banchan.', price: 9000, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isVegetarian: false, prepTime: 60 },
      { id: 'm13', name: 'Budae Jjigae', description: 'Army stew with kimchi, tofu, noodles, and assorted meats.', price: 3200, image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400', isVegetarian: false, prepTime: 45 },
    ],
  },
};

// Social Media Icon Components
function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// Generate sample available slots for next 2 weeks
function getAvailableSlots() {
  const slots: Array<{ date: string; displayDate: string; times: string[] }> = [];
  const today = new Date();

  for (let i = 2; i < 16; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip some days randomly to make it realistic
    if (i % 3 === 0) continue;

    const dayOfWeek = date.getDay();
    // Different times for weekdays vs weekends
    const times = dayOfWeek === 0 || dayOfWeek === 6
      ? ['12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM']
      : ['6:30 PM', '7:00 PM', '7:30 PM'];

    slots.push({
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      times
    });
  }
  return slots;
}

// Booking Modal Component
function BookingModal({
  isOpen,
  onClose,
  menu,
  chefName
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: { id: string; name: string; price: number; prepTime: number } | null;
  chefName: string;
}) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableSlots = getAvailableSlots();

  if (!isOpen || !menu) return null;

  const selectedSlotData = availableSlots.find(s => s.date === selectedSlot);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedTime) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setSelectedSlot(null);
      setSelectedTime(null);
      setGuests(2);
      setNotes('');
    }, 2000);
  };

  const totalPrice = (menu.price * guests) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl my-8">
        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Booking Request Sent!</h3>
            <p className="mt-2 text-gray-600">
              {chefName} will confirm your booking shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Book This Dish</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-orange-50 p-4">
              <h4 className="font-medium text-gray-900">{menu.name}</h4>
              <p className="text-sm text-gray-600">by {chefName}</p>
              <p className="mt-1 text-lg font-semibold text-orange-500">
                ${(menu.price / 100).toFixed(2)} per person
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Available Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Available Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.date}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot.date);
                        setSelectedTime(null);
                      }}
                      className={`flex-shrink-0 rounded-lg border px-4 py-3 text-center transition ${
                        selectedSlot === slot.date
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className="text-sm font-medium">{slot.displayDate}</div>
                      <div className="text-xs text-gray-500">{slot.times.length} slots</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Times */}
              {selectedSlotData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedSlotData.times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          selectedTime === time
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Special Requests (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, dietary restrictions, special occasions..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-semibold text-orange-500">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">for {guests} guest{guests > 1 ? 's' : ''}</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlot || !selectedTime}
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Request...' : !selectedSlot ? 'Select a date' : !selectedTime ? 'Select a time' : 'Request Booking'}
              </button>
              <p className="text-center text-xs text-gray-500">
                You won&apos;t be charged until the chef confirms your booking
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChefPage() {
  const params = useParams();
  const id = params.id as string;
  const chef = sampleChefs[id];

  const [selectedMenu, setSelectedMenu] = useState<typeof chef.menus[0] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!chef) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Chef Not Found</h1>
          <p className="mt-2 text-gray-600">The chef you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/explore" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const handleSelectAndBook = (menu: typeof chef.menus[0]) => {
    setSelectedMenu(menu);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Potluck
            </Link>
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </Link>
              <Link href="/become-chef" className="text-gray-600 hover:text-gray-900">
                Become a Chef
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chef Header */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/explore" className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-orange-500">
            ← Back to Explore
          </Link>
          <div className="mt-4 grid gap-8 md:grid-cols-3">
            {/* Chef Image */}
            <div className="md:col-span-1">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-200">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Chef Info */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{chef.name}</h1>
                  <p className="mt-1 text-lg text-gray-600">{chef.specialty} Cuisine</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{chef.rating}</span>
                    <span className="text-gray-500">({chef.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>{chef.location}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {chef.cuisines.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-gray-700">{chef.bio}</p>

              {/* Social Media Links */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-gray-500">Follow:</span>
                {chef.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${chef.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-pink-100 hover:text-pink-600"
                    title="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {chef.socialMedia.facebook && (
                  <a
                    href={`https://facebook.com/${chef.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-blue-100 hover:text-blue-600"
                    title="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {chef.socialMedia.tiktok && (
                  <a
                    href={`https://tiktok.com/@${chef.socialMedia.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-800 hover:text-white"
                    title="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                )}
                {chef.socialMedia.youtube && (
                  <a
                    href={`https://youtube.com/@${chef.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-red-100 hover:text-red-600"
                    title="YouTube"
                  >
                    <YouTubeIcon />
                  </a>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    if (chef.menus.length > 0) {
                      handleSelectAndBook(chef.menus[0]);
                    }
                  }}
                  className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
                >
                  Book Now
                </button>
                <button className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                  Message Chef
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menus */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
        <p className="mt-2 text-gray-600">Choose from {chef.name}&apos;s signature dishes</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chef.menus.map((menu) => (
            <div
              key={menu.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                  {menu.isVegetarian && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Vegetarian
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{menu.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-orange-500">
                    ${(menu.price / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">⏱ {menu.prepTime} mins</span>
                </div>
                <button
                  onClick={() => handleSelectAndBook(menu)}
                  className="mt-4 w-full rounded-lg bg-orange-500 py-2 font-medium text-white hover:bg-orange-600"
                >
                  Select & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <div className="mt-6 space-y-6">
            {/* Sample reviews */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold">
                  JL
                </div>
                <div>
                  <p className="font-medium">John Lee</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    ★★★★★
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-500">2 weeks ago</span>
              </div>
              <p className="mt-3 text-gray-700">
                Amazing experience! The food was authentic and delicious. {chef.name} was so welcoming
                and shared stories about each dish. Will definitely come back!
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold">
                  SC
                </div>
                <div>
                  <p className="font-medium">Sarah Chen</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    ★★★★★
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-500">1 month ago</span>
              </div>
              <p className="mt-3 text-gray-700">
                Such a unique dining experience. The attention to detail in every dish was incredible.
                Highly recommend for anyone looking for authentic home-cooked food.
              </p>
            </div>
          </div>
          <button className="mt-6 text-orange-500 hover:text-orange-600 font-medium">
            View all {chef.reviewCount} reviews →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Potluck. All rights reserved.
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        menu={selectedMenu}
        chefName={chef.name}
      />
    </div>
  );
}
