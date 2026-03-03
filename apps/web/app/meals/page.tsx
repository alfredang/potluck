'use client';

import Link from 'next/link';
import { useState } from 'react';

const meals = [
  {
    id: '1',
    name: 'Nasi Lemak Special',
    chef: 'Chef Sarah Tan',
    price: 12,
    cuisine: 'Malaysian',
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400',
  },
  {
    id: '2',
    name: 'Homemade Pasta',
    chef: 'Chef Maria Santos',
    price: 18,
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
  },
  {
    id: '3',
    name: 'Thai Green Curry',
    chef: 'Chef Somchai',
    price: 15,
    cuisine: 'Thai',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
  },
  {
    id: '4',
    name: 'Sushi Platter',
    chef: 'Chef Kenji Yamamoto',
    price: 28,
    cuisine: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
  },
  {
    id: '5',
    name: 'Butter Chicken',
    chef: 'Chef Priya Sharma',
    price: 16,
    cuisine: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
  },
  {
    id: '6',
    name: 'Kung Pao Chicken',
    chef: 'Chef Wei Ming',
    price: 14,
    cuisine: 'Chinese',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
  },
];

export default function MealsPage() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = ['All', 'Malaysian', 'Italian', 'Thai', 'Japanese', 'Indian', 'Chinese', 'Western'];

  const filteredMeals = selectedCuisine === 'All' 
    ? meals 
    : meals.filter(m => m.cuisine === selectedCuisine);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-orange-500 text-white p-6 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🍱 PotLuck</h1>
          <Link href="/profile" className="text-2xl">👤</Link>
        </div>
        <h2 className="text-2xl font-semibold">Delicious Meals</h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="🔍 Search for meals..."
          className="w-full bg-white p-4 rounded-xl border border-gray-200"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto">
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

      {/* Meal List */}
      <div className="p-4 space-y-4 pb-24">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="bg-white rounded-2xl p-4 shadow-sm flex">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-28 h-24 rounded-xl object-cover"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{meal.name}</h3>
              <p className="text-gray-600 text-sm">by {meal.chef}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-500 font-bold">${meal.price}</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                  {meal.cuisine}
                </span>
              </div>
            </div>
            <button className="bg-orange-500 text-white w-10 h-10 rounded-full self-center text-xl">
              +
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <Link href="/" className="text-gray-500 text-center text-xs">🏠<br/>Home</Link>
        <Link href="/chefs" className="text-gray-500 text-center text-xs">👨‍🍳<br/>Chefs</Link>
        <Link href="/meals" className="text-orange-500 text-center text-xs font-semibold">🍽️<br/>Meals</Link>
        <Link href="/cart" className="text-gray-500 text-center text-xs">🛒<br/>Cart</Link>
        <Link href="/profile" className="text-gray-500 text-center text-xs">👤<br/>Profile</Link>
      </div>
    </div>
  );
}
