
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AddToCartBarProps {
  product: Product;
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or available stock

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
      return;
    }

    // Add to cart and navigate to checkout
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const getUserRole = () => {
    if (!user) return 'buyer';
    return user.user_metadata?.role || 'buyer';
  };

  // Don't show cart options to sellers
  if (getUserRole() === 'seller') {
    return null;
  }

  return (
    <Card className="sticky bottom-4 z-10 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Price Display */}
          <div className="flex-shrink-0">
            <div className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="w-3 h-3" />
              </Button>
              
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity || isOutOfStock}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs text-orange-600">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 flex-1 justify-end">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 max-w-[120px]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 max-w-[120px] bg-orange-500 hover:bg-orange-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>

        {isOutOfStock && (
          <div className="mt-2 p-2 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 text-center">
              This product is currently out of stock
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddToCartBar;
