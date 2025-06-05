
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching products from Supabase...');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Raw products data from Supabase:', data);

        // Transform the data to match our Product type
        const transformedProducts = data.map(product => ({
          id: product.id,
          sellerId: product.seller_id,
          sellerName: product.seller_name,
          title: product.title,
          description: product.description,
          price: Number(product.price),
          originalPrice: product.original_price ? Number(product.original_price) : undefined,
          images: Array.isArray(product.images) ? product.images : [product.images].filter(Boolean),
          category: product.category,
          stock: product.stock,
          rating: Number(product.rating || 0),
          reviewCount: product.review_count || 0,
          featured: product.featured || false,
          createdAt: product.created_at
        }));

        console.log('Transformed products:', transformedProducts);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading };
};
