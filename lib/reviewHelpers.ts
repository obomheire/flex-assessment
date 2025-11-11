// Helper functions for working with reviews

export function calculateAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function parseCategories(categoriesJson: string): Record<string, number> {
  try {
    return JSON.parse(categoriesJson);
  } catch {
    return {};
  }
}

export function calculateCategoryAverages(
  reviews: { categories: string }[]
): Record<string, number> {
  const categoryTotals: Record<string, { sum: number; count: number }> = {};

  reviews.forEach((review) => {
    const categories = parseCategories(review.categories);
    Object.entries(categories).forEach(([key, value]) => {
      if (!categoryTotals[key]) {
        categoryTotals[key] = { sum: 0, count: 0 };
      }
      categoryTotals[key].sum += value;
      categoryTotals[key].count += 1;
    });
  });

  const averages: Record<string, number> = {};
  Object.entries(categoryTotals).forEach(([key, { sum, count }]) => {
    averages[key] = Math.round((sum / count) * 10) / 10;
  });

  return averages;
}

export function getRatingColor(rating: number): string {
  if (rating >= 9) return 'text-green-600';
  if (rating >= 7.5) return 'text-blue-600';
  if (rating >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

export function getRatingBadgeColor(rating: number): string {
  if (rating >= 9) return 'bg-green-100 text-green-800';
  if (rating >= 7.5) return 'bg-blue-100 text-blue-800';
  if (rating >= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

