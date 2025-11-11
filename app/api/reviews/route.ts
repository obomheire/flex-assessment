import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const rating = searchParams.get('rating');
    const channel = searchParams.get('channel');
    const listingId = searchParams.get('listingId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isApproved = searchParams.get('isApproved');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {};

    if (rating) {
      const ratingNum = parseFloat(rating);
      where.rating = { gte: ratingNum };
    }

    if (channel) {
      where.channel = channel;
    }

    if (listingId) {
      where.listingId = parseInt(listingId);
    }

    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) {
        where.submittedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.submittedAt.lte = new Date(endDate);
      }
    }

    if (isApproved !== null && isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    // Get total count for pagination
    const total = await prisma.review.count({ where });

    // Fetch reviews with pagination
    const reviews = await prisma.review.findMany({
      where,
      include: {
        listing: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      status: 'success',
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

