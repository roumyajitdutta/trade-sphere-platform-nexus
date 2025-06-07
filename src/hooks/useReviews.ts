
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchReviews = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (orderId: string, rating: number, comment?: string) => {
    if (!user || !productId) return;

    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          order_id: orderId,
          rating,
          comment
        })
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Review added successfully"
      });
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive"
      });
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .update({ rating, comment, updated_at: new Date().toISOString() })
        .eq('id', reviewId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => prev.map(r => r.id === reviewId ? data : r));
      toast({
        title: "Success",
        description: "Review updated successfully"
      });
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return {
    reviews,
    isLoading,
    addReview,
    updateReview,
    refetch: () => productId && fetchReviews(productId)
  };
};
