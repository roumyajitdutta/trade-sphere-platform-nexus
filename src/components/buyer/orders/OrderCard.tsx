
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price_per_item: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  order_items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'accepted':
      return <Package className="w-4 h-4" />;
    case 'shipped':
      return <Truck className="w-4 h-4" />;
    case 'delivered':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusMessage = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Waiting for seller confirmation';
    case 'accepted':
      return 'Order confirmed by seller';
    case 'shipped':
      return 'Order has been shipped';
    case 'delivered':
      return 'Order delivered successfully';
    case 'rejected':
      return 'Order rejected by seller';
    case 'cancelled':
      return 'Order cancelled';
    default:
      return '';
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const displayItems = order.order_items?.slice(0, 3) || [];
  const remainingCount = (order.order_items?.length || 0) - 3;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <Badge className={`flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusMessage(order.status)}
                </p>
              </div>
            </div>

            {/* Product Thumbnails */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {displayItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {order.order_items?.length === 1 
                  ? order.order_items[0].product_name
                  : `${order.order_items?.length || 0} items`
                }
              </div>
            </div>

            {/* Total */}
            <div className="text-lg font-semibold">
              ${order.total.toFixed(2)}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Button onClick={onViewDetails} variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
