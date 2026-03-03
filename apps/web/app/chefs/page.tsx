'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const chefs = [
  {
    id: '1',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    rating: 4.9,
    reviewCount: 127,
    location: 'Tiong Bahru',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    cuisines: ['Peranakan', 'Chinese'],
  },
  {
    id: '2',
    name: 'Chef Ahmad Rahman',
    specialty: 'Malay',
    rating: 4.8,
    reviewCount: 89,
    location: 'Geylang Serai',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    cuisines: ['Malay', 'Halal'],
  },
  {
    id: '3',
    name: 'Chef Maria Santos',
    specialty: 'Filipino',
    rating: 4.7,
    reviewCount: 64,
    location: 'Toa Payoh',
    image: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=400',
    cuisines: ['Filipino', 'Western'],
  },
  {
    id: '4',
    name: 'Chef Kenji Yamamoto',
    specialty: 'Japanese',
    rating: 4.9,
    reviewCount: 156,
    location: 'Orchard',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400',
    cuisines: ['Japanese', 'Sushi'],
  },
  {
    id: '5',
    name: 'Chef Priya Sharma',
    specialty: 'Indian',
    rating: 4.8,
    reviewCount: 98,
    location: 'Little India',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400',
    cuisines: ['Indian', 'Vegetarian'],
  },
];

export default function ChefsPage() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = ['All', 'Peranakan', 'Malay', 'Filipino', 'Japanese', 'Indian', 'Chinese', 'Western'];

  const filteredChefs = selectedCuisine === 'All' 
    ? chefs 
    : chefs.filter(c => c.cuisines.includes(selectedCuisine));

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-orange-500 text-white p-6 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🍱 PotLuck</h1>
          <Link href="/profile" className="text-2xl">👤</Link>
        </div>
        <h2 className="text-2xl font-semibold">Our Chefs</h2>
      </div>

      {/* Filter */}
      <div className="flex gap-3 p-4 overflow-x-auto">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCuisine === cuisine
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Chef List */}
      <div className="p-4 space-y-4">
        {filteredChefs.map((chef) => (
          <Link href={`/chef/${chef.id}`} key={chef.id}>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center">
              <img
                src={chef.image}
                alt={chef.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{chef.name}</h3>
                <p className="text-gray-600 text-sm">{chef.specialty} • {chef.location}</p>
                <p className="text-orange-500 text-sm">⭐ {chef.rating} ({chef.reviewCount} orders)</p>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                {chef.cuisines[0]}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <Link href="/" className="text-gray-500 text-center text-xs">🏠<br/>Home</Link>
        <Link href="/chefs" className="text-orange-500 text-center text-xs font-semibold">👨‍🍳<br/>Chefs</Link>
        <Link href="/explore" className="text-gray-500 text-center text-xs">🍽️<br/>Meals</Link>
        <Link href="/cart" className="text-gray-500 text-center text-xs">🛒<br/>Cart</Link>
        <Link href="/profile" className="text-gray-500 text-center text-xs">👤<br/>Profile</Link>
      </div>
    </div>
  );
}
