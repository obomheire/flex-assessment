'use client';

import { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyHero } from '@/components/property/PropertyHero';
import { ReviewsSection } from '@/components/property/ReviewsSection';
import { calculateAverageRating } from '@/lib/reviewHelpers';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: listingsData } = useSWR('/api/listings', fetcher);
  const listing = listingsData?.data?.find((l: any) => l.slug === slug);
  
  const { data: reviewsData } = useSWR(
    listing ? `/api/reviews?listingId=${listing.id}&isApproved=true` : null,
    fetcher
  );

  const approvedReviews = reviewsData?.data || [];
  const avgRating = calculateAverageRating(approvedReviews);

  if (!listingsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
            <Link
              href="/properties"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amenities = listing.amenities ? JSON.parse(listing.amenities) : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <PropertyHero
        name={listing.name}
        location={listing.location}
        imageUrl={listing.imageUrl}
        avgRating={avgRating}
        reviewCount={approvedReviews.length}
      />

      {/* Property Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                {listing.description || 
                  `Welcome to ${listing.name}, a beautifully designed space in the heart of ${listing.location}. ` +
                  `This property offers the perfect blend of comfort, style, and convenience for modern living. ` +
                  `Whether you're here for work or leisure, you'll find everything you need for an exceptional stay.`
                }
              </p>

              {amenities.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700 font-medium">{listing.location}</p>
                  <p className="text-sm text-gray-500 mt-1">Prime location with easy access to local attractions</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book your stay</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition">
                    Check Availability
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Questions? <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Contact us</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {approvedReviews.length > 0 && (
        <ReviewsSection reviews={approvedReviews} avgRating={avgRating} />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Flex Living</h3>
              <p className="text-gray-400">Flexible spaces. Extraordinary experiences.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/properties" className="hover:text-white transition">Properties</Link></li>
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Flex Living. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

