'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/property/RatingStars';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardReviewsPage() {
  const { data: listingsData, error } = useSWR('/api/listings', fetcher);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load listings</p>
      </div>
    );
  }

  if (!listingsData) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  const listings = listingsData.data || [];

  // Calculate overall stats
  const totalReviews = listings.reduce((sum: number, l: any) => sum + l.stats.totalReviews, 0);
  const totalApproved = listings.reduce((sum: number, l: any) => sum + l.stats.approvedReviews, 0);
  const avgRating = listings.length > 0
    ? listings.reduce((sum: number, l: any) => sum + l.stats.avgRating, 0) / listings.length
    : 0;

  // Filter listings
  let filteredListings = [...listings];
  
  // Sort listings
  filteredListings.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'rating':
        return b.stats.avgRating - a.stats.avgRating;
      case 'reviews':
        return b.stats.totalReviews - a.stats.totalReviews;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage and analyze guest reviews across all properties
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Reviews"
          value={totalReviews}
          subtitle={`${totalApproved} approved`}
          icon={
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        />
        <StatsCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          subtitle="Across all properties"
          icon={
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatsCard
          title="Properties"
          value={listings.length}
          subtitle="Active listings"
          icon={
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing: any) => (
          <Link
            key={listing.id}
            href={`/dashboard/reviews/${listing.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group"
          >
            <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 relative overflow-hidden">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-16 h-16 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-teal-600 transition">
                {listing.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{listing.location}</p>
              
              <div className="flex items-center justify-between mb-3">
                <RatingStars rating={listing.stats.avgRating} size="sm" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {listing.stats.totalReviews} reviews
                </span>
                <Badge variant={listing.stats.approvedReviews > 0 ? 'success' : 'default'}>
                  {listing.stats.approvedReviews} approved
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

