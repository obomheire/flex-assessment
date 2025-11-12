'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { RatingStars } from '@/components/property/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { ApprovalToggle } from '@/components/dashboard/ApprovalToggle';
import { RatingChart } from '@/components/dashboard/RatingChart';
import { formatDate } from '@/lib/dateHelpers';
import { parseCategories, formatCategoryName } from '@/lib/reviewHelpers';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ListingReviewsPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = use(params);
  const { data: reviewsData, mutate } = useSWR(`/api/reviews?listingId=${listingId}`, fetcher);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!reviewsData) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <p className="mt-4 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  const reviews = reviewsData.data || [];
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No reviews found for this property</p>
        <Link href="/dashboard/reviews" className="mt-4 inline-block text-teal-600 hover:text-teal-700">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const listing = reviews[0].listing;

  // Filter reviews
  let filteredReviews = reviews;
  if (channelFilter !== 'all') {
    filteredReviews = filteredReviews.filter((r: any) => r.channel === channelFilter);
  }
  if (statusFilter !== 'all') {
    const isApproved = statusFilter === 'approved';
    filteredReviews = filteredReviews.filter((r: any) => r.isApproved === isApproved);
  }

  // Calculate category averages
  const categoryTotals: Record<string, { sum: number; count: number }> = {};
  reviews.forEach((review: any) => {
    const categories = parseCategories(review.categories);
    Object.entries(categories).forEach(([key, value]) => {
      if (!categoryTotals[key]) {
        categoryTotals[key] = { sum: 0, count: 0 };
      }
      categoryTotals[key].sum += value as number;
      categoryTotals[key].count += 1;
    });
  });

  const handleToggle = () => {
    mutate();
  };

  const channels = [...new Set(reviews.map((r: any) => r.channel))] as string[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/reviews"
          className="text-teal-600 hover:text-teal-700 inline-flex items-center gap-2 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
        <p className="mt-2 text-gray-600">{listing.location}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Trend</h2>
          <RatingChart reviews={reviews} type="line" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Averages</h2>
          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([category, { sum, count }]) => {
              const avg = sum / count;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {formatCategoryName(category)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {avg.toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${(avg / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel
            </label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="all">All Channels</option>
              {channels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reviews ({filteredReviews.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review: any) => {
            const categories = parseCategories(review.categories);
            return (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                      <Badge variant="info">{review.channel}</Badge>
                      {review.isApproved && <Badge variant="success">Approved</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(review.submittedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <RatingStars rating={review.rating} size="sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Approve</span>
                      <ApprovalToggle
                        reviewId={review.id}
                        initialApproved={review.isApproved}
                        onToggle={handleToggle}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{review.reviewText}</p>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(categories).map(([key, value]) => (
                    <span
                      key={key}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {formatCategoryName(key)}: {value}/10
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

