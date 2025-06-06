
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  category 
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, category]);

  const fetchRelatedProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', currentProductId)
        .limit(8)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Transform the data
      const transformedProducts = (data || []).map(product => ({
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

      setRelatedProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Products in {category}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductGrid products={relatedProducts} />
      </CardContent>
    </Card>
  );
};

export default RelatedProducts;
