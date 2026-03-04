'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FOOD_CATEGORIES } from '@homechef/shared';

// Sample chef data (will be replaced with database query)
const sampleChefs = [
  {
    id: '1',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    rating: 4.9,
    reviewCount: 127,
    location: 'Tiong Bahru',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    priceRange: '$40-60',
    minPrice: 40,
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
    priceRange: '$35-50',
    minPrice: 35,
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
    priceRange: '$30-45',
    minPrice: 30,
    cuisines: ['Filipino', 'Western'],
  },
  {
    id: '4',
    name: 'Chef Kenji Yamamoto',
    specialty: 'Japanese',
    rating: 4.9,
    reviewCount: 156,
    location: 'Robertson Quay',
    image: 'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?w=400',
    priceRange: '$60-90',
    minPrice: 60,
    cuisines: ['Japanese'],
  },
  {
    id: '5',
    name: 'Chef Priya Sharma',
    specialty: 'Indian',
    rating: 4.8,
    reviewCount: 103,
    location: 'Little India',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400',
    priceRange: '$35-55',
    minPrice: 35,
    cuisines: ['Indian', 'Vegetarian'],
  },
  {
    id: '6',
    name: 'Chef Kim Soo-young',
    specialty: 'Korean',
    rating: 4.7,
    reviewCount: 78,
    location: 'Tanjong Pagar',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400',
    priceRange: '$45-65',
    minPrice: 45,
    cuisines: ['Korean'],
  },
];

function ExploreContent() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // Set initial category from URL params after mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filter and sort chefs
  const filteredChefs = useMemo(() => {
    let result = [...sampleChefs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (chef) =>
          chef.name.toLowerCase().includes(query) ||
          chef.specialty.toLowerCase().includes(query) ||
          chef.location.toLowerCase().includes(query) ||
          chef.cuisines.some((c) => c.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryName = FOOD_CATEGORIES.find((c) => c.slug === selectedCategory)?.name;
      if (categoryName) {
        result = result.filter(
          (chef) =>
            chef.cuisines.some((c) => c.toLowerCase() === categoryName.toLowerCase()) ||
            chef.specialty.toLowerCase() === categoryName.toLowerCase()
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.minPrice - a.minPrice);
        break;
      default:
        // recommended - keep original order with slight boost for higher ratings
        result.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Potluck" className="h-10 w-auto" />
              Potluck
            </Link>
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="/explore" className="text-orange-500 font-medium">
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

      {/* Hero */}
      <div className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Home Chefs</h1>
          <p className="mt-2 text-gray-600">
            Discover talented home chefs and their unique culinary creations
          </p>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by cuisine, chef name, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Cuisines</option>
              {FOOD_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="rating">Rating: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {FOOD_CATEGORIES.slice(0, 8).map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category.slug
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chef Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredChefs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No chefs found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Showing {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChefs.map((chef) => (
                <Link
                  key={chef.id}
                  href={`/chef/${chef.id}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{chef.name}</h3>
                        <p className="text-sm text-gray-600">{chef.specialty} Cuisine</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{chef.rating}</span>
                        <span className="text-gray-500">({chef.reviewCount})</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <span>📍 {chef.location}</span>
                      <span>•</span>
                      <span>{chef.priceRange} per person</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chef.cuisines.map((cuisine) => (
                        <span
                          key={cuisine}
                          className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* End of Results */}
        {filteredChefs.length > 0 && filteredChefs.length === sampleChefs.length && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">You&apos;ve seen all {filteredChefs.length} chefs</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return <ExploreContent />;
}
