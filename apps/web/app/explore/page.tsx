'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FOOD_CATEGORIES } from '@homechef/shared';

import { CHEFS } from '../../lib/chefs-data';
import { SiteNav } from '../components/SiteNav';

// Maps a category slug to the cuisine strings (lowercased) that should match it.
// Lets one filter chip cover several natural cuisine labels used on chef cards
// (e.g. "Local & Hawker" covers "Local", "Hainanese", "Hawker").
const CATEGORY_CUISINE_MATCHES: Record<string, string[]> = {
  'indian-muslim': ['indian-muslim', 'mamak'],
  'local-hawker': ['local', 'hawker', 'hainanese', 'local & hawker'],
  hainanese: ['hainanese'],
  peranakan: ['peranakan', 'nyonya'],
};

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
    let result = [...CHEFS];

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
        const wanted = new Set<string>([
          categoryName.toLowerCase(),
          ...(CATEGORY_CUISINE_MATCHES[selectedCategory] ?? []),
        ]);
        result = result.filter(
          (chef) =>
            chef.cuisines.some((c) => wanted.has(c.toLowerCase())) ||
            wanted.has(chef.specialty.toLowerCase())
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
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <SiteNav active="/explore" />

      {/* Hero */}
      <div className="border-b border-orange-100 bg-gradient-to-br from-orange-100/60 via-amber-50/50 to-[var(--cream)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Explore Home Chefs</h1>
          <p className="mt-2 text-gray-600">
            Discover talented home chefs across Singapore — from Tiong Bahru to Tampines — and their
            signature home-cooked menus.
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
                  className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={chef.image}
                      alt={`${chef.name} — ${chef.specialty} home chef in ${chef.location}, Singapore`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-bold text-gray-900">{chef.name}</h3>
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
        {filteredChefs.length > 0 && filteredChefs.length === CHEFS.length && (
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
