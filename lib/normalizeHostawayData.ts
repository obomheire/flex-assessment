// Normalize Hostaway API response to our internal format

export interface HostawayReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  listingId: number;
  listingName: string;
  guestName: string;
  rating: number;
  categories: {
    cleanliness?: number;
    communication?: number;
    respect_house_rules?: number;
    value?: number;
    location?: number;
  };
  reviewText: string;
  submittedAt: string;
  channel: string;
  status: string;
}

export function normalizeHostawayReview(review: HostawayReview): NormalizedReview {
  // Calculate overall rating from categories if not provided
  let overallRating = review.rating;
  
  if (!overallRating && review.reviewCategory.length > 0) {
    const sum = review.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0);
    overallRating = sum / review.reviewCategory.length;
  }

  // Normalize categories to object format
  const categories: NormalizedReview['categories'] = {};
  review.reviewCategory.forEach((cat) => {
    const categoryKey = cat.category.toLowerCase().replace(/\s+/g, '_');
    categories[categoryKey as keyof typeof categories] = cat.rating;
  });

  return {
    listingId: review.id,
    listingName: review.listingName,
    guestName: review.guestName,
    rating: overallRating || 0,
    categories,
    reviewText: review.publicReview,
    submittedAt: review.submittedAt,
    channel: 'Hostaway',
    status: review.status,
  };
}

export function normalizeHostawayResponse(response: { result: HostawayReview[] }) {
  return response.result.map(normalizeHostawayReview);
}

