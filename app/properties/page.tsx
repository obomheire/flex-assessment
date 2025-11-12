'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { RatingStars } from '@/components/property/RatingStars';
import { Badge } from '@/components/ui/Badge';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PropertiesPage() {
  const { data: listingsData } = useSWR('/api/listings', fetcher);

  const listings = listingsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-600 to-blue-430g text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h1 className="text-5xl font-bold mb-4">Discover Your Next Home</h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Flexible living spaces in the world's most vibrant cities. Find your perfect match.
            </p>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h2>
            <p className="text-gray-600">{listings.length} properties available</p>
          </div>

          {!listingsData ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/properties/${listing.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-blue-100 relative overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-20 h-20 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    {listing.stats.avgRating >= 9 && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="success" className="shadow-lg">
                          Top Rated
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-teal-600 transition">
                      {listing.name}
                    </h3>
                    <p className="text-gray-600 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location}
                    </p>

                    {listing.stats.approvedReviews > 0 && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <RatingStars rating={listing.stats.avgRating} size="sm" />
                        <span className="text-sm text-gray-600">
                          {listing.stats.approvedReviews} {listing.stats.approvedReviews === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Flex Living</h3>
            <p className="text-gray-400">Flexible spaces. Extraordinary experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

