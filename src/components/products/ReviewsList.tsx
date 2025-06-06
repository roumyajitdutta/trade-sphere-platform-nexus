
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Review {
  id: string;
  username: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
}

interface ReviewsListProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, rating, reviewCount }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock reviews data
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
        username: 'John D.',
        rating: 5,
        title: 'Excellent product!',
        comment: 'This product exceeded my expectations. Great quality and fast delivery. Highly recommended!',
        date: '2024-01-15',
        verified: true,
        helpful: 12,
        notHelpful: 1,
      },
      {
        id: '2',
        username: 'Sarah M.',
        rating: 4,
        title: 'Good value for money',
        comment: 'Product is good but packaging could be better. Overall satisfied with the purchase.',
        date: '2024-01-10',
        verified: true,
        helpful: 8,
        notHelpful: 0,
      },
      {
        id: '3',
        username: 'Mike R.',
        rating: 5,
        title: 'Perfect!',
        comment: 'Exactly what I was looking for. Works perfectly and arrived quickly.',
        date: '2024-01-08',
        verified: false,
        helpful: 6,
        notHelpful: 0,
      },
    ];
    setReviews(mockReviews);
  }, [productId]);

  const ratingDistribution = [
    { stars: 5, count: Math.floor(reviewCount * 0.6) },
    { stars: 4, count: Math.floor(reviewCount * 0.25) },
    { stars: 3, count: Math.floor(reviewCount * 0.1) },
    { stars: 2, count: Math.floor(reviewCount * 0.03) },
    { stars: 1, count: Math.floor(reviewCount * 0.02) },
  ];

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'verified') return review.verified;
    if (filter === 'with-photos') return review.images && review.images.length > 0;
    return review.rating === parseInt(filter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviewCount} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count }) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm w-6">{stars}★</span>
                  <Progress 
                    value={(count / reviewCount) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No reviews match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.username}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {review.title}
                    </h4>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Not Helpful ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {sortedReviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
