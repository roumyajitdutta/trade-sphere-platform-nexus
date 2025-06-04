
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Truck, RotateCcw, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId, onBack }) => {
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            price_per_item,
            product_id
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="text-center text-red-600">
            Error loading order details: {error?.message || 'Order not found'}
          </div>
        </div>
      </div>
    );
  }

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.quantity * item.price_per_item), 0) || 0;
  const shipping = 9.99; // Mock shipping cost
  const tax = subtotal * 0.08; // Mock 8% tax

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-600">
                Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">${item.price_per_item.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.quantity * item.price_per_item).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Delivery Address:</p>
                    <p className="text-gray-600">{order.shipping_address}</p>
                  </div>
                  {order.estimated_delivery_date && (
                    <div>
                      <p className="font-medium">Estimated Delivery:</p>
                      <p className="text-gray-600">
                        {format(new Date(order.estimated_delivery_date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {order.courier_name && (
                    <div>
                      <p className="font-medium">Courier:</p>
                      <p className="text-gray-600">{order.courier_name}</p>
                    </div>
                  )}
                  {order.tracking_number && (
                    <div>
                      <p className="font-medium">Tracking Number:</p>
                      <p className="text-blue-600 font-mono">{order.tracking_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Payment Method:</p>
                    <p className="text-gray-600">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Status:</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Paid
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                {order.tracking_number && (
                  <Button className="w-full" variant="outline">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
                {order.status === 'delivered' && (
                  <Button className="w-full" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Return/Replace
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
