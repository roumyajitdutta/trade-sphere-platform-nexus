
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useReviews } from '@/hooks/useReviews';
import Layout from '@/components/layout/Layout';
import ProductImageCarousel from '@/components/products/ProductImageCarousel';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import RelatedProducts from '@/components/products/RelatedProducts';
import ReviewsList from '@/components/products/ReviewsList';
import AddToCartBar from '@/components/products/AddToCartBar';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { trackProductView } = useAnalytics();
  const { reviews } = useReviews(id);
  
  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      // Track product view
      trackProductView(id);
    }
  }, [id, trackProductView]);

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductImageCarousel images={product.images} productTitle={product.title} />
            <ProductInfoPanel product={product} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ProductSpecifications product={product} />
            </div>
          </div>

          <div className="mb-12">
            <ReviewsList 
              productId={product.id} 
              rating={product.rating} 
              reviewCount={product.reviewCount} 
            />
          </div>

          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </div>
      
      <AddToCartBar product={product} />
    </Layout>
  );
};

export default ProductDetailPage;
