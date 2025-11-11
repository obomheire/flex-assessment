'use client';

import { useState } from 'react';

interface ApprovalToggleProps {
  reviewId: string;
  initialApproved: boolean;
  onToggle?: (reviewId: string, isApproved: boolean) => void;
}

export function ApprovalToggle({ reviewId, initialApproved, onToggle }: ApprovalToggleProps) {
  const [isApproved, setIsApproved] = useState(initialApproved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newValue = !isApproved;

    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          isApproved: newValue,
        }),
      });

      if (response.ok) {
        setIsApproved(newValue);
        onToggle?.(reviewId, newValue);
      } else {
        console.error('Failed to update approval status');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 ${
        isApproved ? 'bg-teal-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle approval</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isApproved ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

