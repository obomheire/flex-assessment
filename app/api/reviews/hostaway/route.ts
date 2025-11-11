import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseCategories } from '@/lib/reviewHelpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listingId = searchParams.get('listingId');
    const status = searchParams.get('status') || 'published';

    // Build query filters
    const where: any = {
      channel: 'Hostaway',
    };

    if (listingId) {
      where.listingId = parseInt(listingId);
    }

    // Fetch reviews from database
    const reviews = await prisma.review.findMany({
      where,
      include: {
        listing: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Transform to Hostaway API format
    const result = reviews.map((review) => {
      const categories = parseCategories(review.categories);
      const reviewCategory = Object.entries(categories).map(([category, rating]) => ({
        category,
        rating,
      }));

      return {
        id: parseInt(review.id),
        type: 'guest-to-host',
        status,
        rating: review.rating,
        publicReview: review.reviewText,
        reviewCategory,
        submittedAt: review.submittedAt.toISOString().replace('T', ' ').slice(0, 19),
        guestName: review.guestName,
        listingName: review.listingName,
      };
    });

    return NextResponse.json({
      status: 'success',
      result,
    });
  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

