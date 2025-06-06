
import React, { useState } from 'react';
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types';

interface ProductInfoPanelProps {
  product: Product;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const checkDelivery = () => {
    if (pincode.length >= 5) {
      // Simulate delivery check
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 2);
      setDeliveryInfo(`Delivery by ${deliveryDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })}`);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Out of Stock', color: 'destructive' as const };
    } else if (product.stock <= 5) {
      return { text: `Only ${product.stock} left in stock`, color: 'secondary' as const };
    } else {
      return { text: 'In Stock', color: 'default' as const };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {product.title}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          
          {product.featured && (
            <Badge variant="secondary">Featured</Badge>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <Badge variant="destructive">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
        
        <p className="text-sm text-gray-600">
          Inclusive of all taxes
        </p>
      </div>

      {/* Stock Status */}
      <div>
        <Badge variant={stockStatus.color}>
          {stockStatus.text}
        </Badge>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Description</h3>
        <div className="text-gray-600">
          {showFullDescription || product.description.length <= 200 ? (
            <p>{product.description}</p>
          ) : (
            <>
              <p>{product.description.substring(0, 200)}...</p>
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => setShowFullDescription(true)}
              >
                Read more
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Key Highlights */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Key Features</h3>
        <ul className="space-y-1 text-gray-600">
          <li>• High-quality materials and construction</li>
          <li>• Fast and reliable performance</li>
          <li>• User-friendly design</li>
          <li>• Excellent value for money</li>
        </ul>
      </div>

      {/* Delivery Check */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Delivery Options</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" onClick={checkDelivery}>
            Check
          </Button>
        </div>
        
        {deliveryInfo && (
          <p className="text-green-600 text-sm font-medium">
            ✓ {deliveryInfo}
          </p>
        )}
      </div>

      {/* Service Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex items-center space-x-2 text-sm">
          <Truck className="w-4 h-4 text-green-600" />
          <span>Free Delivery</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <span>30 Day Returns</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>1 Year Warranty</span>
        </div>
      </div>

      {/* Seller Info */}
      <div className="pt-4 border-t">
        <div className="text-sm text-gray-600">
          Sold by: <span className="font-medium text-gray-900">{product.sellerName}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
