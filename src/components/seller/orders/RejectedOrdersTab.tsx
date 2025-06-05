
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

interface RejectedOrdersTabProps {
  orders: Order[];
}

const RejectedOrdersTab: React.FC<RejectedOrdersTabProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No rejected orders</div>
        <div className="text-sm text-gray-400">
          Rejected orders will appear here
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
                <Badge className="bg-red-100 text-red-800">
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

export default RejectedOrdersTab;
