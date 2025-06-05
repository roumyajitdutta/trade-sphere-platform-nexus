
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

interface PendingOrdersTabProps {
  orders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
}

const PendingOrdersTab: React.FC<PendingOrdersTabProps> = ({ orders, onAcceptOrder, onRejectOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No pending orders</div>
        <div className="text-sm text-gray-400">
          New orders will appear here when customers place them
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
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to accept this order for ${order.total}? 
                          This action will notify the buyer and update the order status.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onAcceptOrder(order.id)}>
                          Yes, Accept Order
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this order for ${order.total}? 
                          This action cannot be undone and will notify the buyer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onRejectOrder(order.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Reject Order
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingOrdersTab;
