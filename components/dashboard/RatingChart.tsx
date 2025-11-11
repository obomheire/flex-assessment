'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';

interface RatingChartProps {
  reviews: any[];
  type?: 'line' | 'bar';
}

export function RatingChart({ reviews, type = 'line' }: RatingChartProps) {
  // Group reviews by month and calculate average rating
  const monthlyData = reviews.reduce((acc: any, review: any) => {
    const month = format(parseISO(review.submittedAt), 'MMM yyyy');
    if (!acc[month]) {
      acc[month] = { month, ratings: [], count: 0 };
    }
    acc[month].ratings.push(review.rating);
    acc[month].count++;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .map((data: any) => ({
      month: data.month,
      avgRating: (data.ratings.reduce((sum: number, r: number) => sum + r, 0) / data.count).toFixed(1),
      count: data.count,
    }))
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  const Chart = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <DataComponent
          type={type === 'line' ? 'monotone' : undefined}
          dataKey="avgRating"
          stroke="#0d9488"
          fill="#0d9488"
          strokeWidth={2}
        />
      </Chart>
    </ResponsiveContainer>
  );
}

