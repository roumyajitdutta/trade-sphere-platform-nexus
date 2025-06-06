
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductImageCarousel from '@/components/products/ProductImageCarousel';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import AddToCartBar from '@/components/products/AddToCartBar';
import ReviewsList from '@/components/products/ReviewsList';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import RelatedProducts from '@/components/products/RelatedProducts';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform the data to match our Product type
      const transformedProduct = {
        id: data.id,
        sellerId: data.seller_id,
        sellerName: data.seller_name,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        images: Array.isArray(data.images) ? data.images : [data.images].filter(Boolean),
        category: data.category,
        stock: data.stock,
        rating: Number(data.rating || 0),
        reviewCount: data.review_count || 0,
        featured: data.featured || false,
        createdAt: data.created_at
      };

      setProduct(transformedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <nav className="text-sm text-gray-500">
          <span>Products</span>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImageCarousel images={product.images} productTitle={product.title} />
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <ProductInfoPanel product={product} />
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Sticky Add to Cart Bar for Mobile */}
          <div className="lg:hidden">
            <AddToCartBar product={product} />
          </div>
        </div>
      </div>

      {/* Desktop Sticky Add to Cart Bar */}
      <div className="hidden lg:block">
        <AddToCartBar product={product} />
      </div>

      {/* Additional Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="delivery">Delivery & Returns</TabsTrigger>
            <TabsTrigger value="seller">Seller Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="mt-6">
            <ProductSpecifications product={product} />
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <ReviewsList productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
          </TabsContent>
          
          <TabsContent value="delivery" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery & Returns</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Delivery Information</h4>
                  <p className="text-gray-600">Free delivery on orders over $50. Standard delivery takes 3-5 business days.</p>
                </div>
                <div>
                  <h4 className="font-medium">Return Policy</h4>
                  <p className="text-gray-600">30-day return policy. Items must be in original condition with tags attached.</p>
                </div>
                <div>
                  <h4 className="font-medium">Warranty</h4>
                  <p className="text-gray-600">1-year manufacturer warranty included.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seller" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{product.sellerName}</h4>
                  <p className="text-gray-600">Verified seller since 2020</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">98% Positive Feedback</Badge>
                  <Badge variant="secondary">Fast Shipping</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProducts 
          currentProductId={product.id} 
          category={product.category} 
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
