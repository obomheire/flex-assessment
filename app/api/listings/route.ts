import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateAverageRating, calculateCategoryAverages } from '@/lib/reviewHelpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeReviews = searchParams.get('includeReviews') === 'true';

    // Fetch all listings
    const listings = await prisma.listing.findMany({
      include: {
        reviews: includeReviews,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate stats for each listing
    const listingsWithStats = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await prisma.review.findMany({
          where: { listingId: listing.id },
        });

        const approvedReviews = reviews.filter((r) => r.isApproved);

        return {
          ...listing,
          stats: {
            totalReviews: reviews.length,
            approvedReviews: approvedReviews.length,
            avgRating: calculateAverageRating(reviews),
            categoryAverages: calculateCategoryAverages(reviews),
            recentReviews: reviews.slice(0, 3).map((r) => ({
              rating: r.rating,
              submittedAt: r.submittedAt,
            })),
          },
          reviews: includeReviews ? reviews : undefined,
        };
      })
    );

    return NextResponse.json({
      status: 'success',
      data: listingsWithStats,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

