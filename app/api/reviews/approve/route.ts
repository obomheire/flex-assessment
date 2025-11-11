import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewId, isApproved } = body;

    if (!reviewId || typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update review approval status
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    return NextResponse.json({
      status: 'success',
      data: review,
    });
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

