
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-semibold">{orderNumber}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Processing
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-semibold">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-gray-600 mb-8">
        We've sent a confirmation email with all the details of your order. 
        You can also track your order status in the "My Orders" section.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/orders')}>
          <Package className="mr-2 h-4 w-4" />
          View My Orders
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
