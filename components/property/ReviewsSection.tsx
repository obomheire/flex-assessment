import { RatingStars } from './RatingStars';
import { formatDate } from '@/lib/dateHelpers';
import { parseCategories, formatCategoryName } from '@/lib/reviewHelpers';
import { Badge } from '@/components/ui/Badge';

interface ReviewsSectionProps {
  reviews: any[];
  avgRating: number;
}

export function ReviewsSection({ reviews, avgRating }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Guest Reviews</h2>
            <Badge variant="success">{reviews.length} reviews</Badge>
          </div>
          <div className="flex items-center gap-6">
            <RatingStars rating={avgRating} size="lg" />
            <p className="text-gray-600">
              Based on {reviews.length} verified guest {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review: any) => {
            const categories = parseCategories(review.categories);
            return (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                      {review.channel && (
                        <Badge variant="info" className="text-xs">
                          {review.channel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(review.submittedAt)}</p>
                  </div>
                  <RatingStars rating={review.rating} size="sm" />
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

                {Object.keys(categories).length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(categories).slice(0, 4).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full font-medium"
                        >
                          {formatCategoryName(key)}: {value}/10
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

