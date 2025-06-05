
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface Order {
  id: string;
  buyer_id: string;
  products: any;
  total: number;
  status: string;
  shipping_address: string;
  created_at: string;
}

interface AllOrdersTabProps {
  orders: Order[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'accepted': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AllOrdersTab: React.FC<AllOrdersTabProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No orders yet</div>
        <div className="text-sm text-gray-400">
          Orders will appear here when customers place them
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {Array.isArray(order.products) ? 
                    `${order.products.length} item(s)` : 
                    'Product details'
                  }
                </div>
              </TableCell>
              <TableCell className="font-medium">
                ${order.total}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllOrdersTab;
