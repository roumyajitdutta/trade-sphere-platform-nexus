
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
import { Truck } from 'lucide-react';

interface Order {
  id: string;
  buyer_id: string;
  products: any;
  total: number;
  status: string;
  shipping_address: string;
  created_at: string;
}

interface AcceptedOrdersTabProps {
  orders: Order[];
  onMarkAsShipped: (orderId: string) => void;
}

const AcceptedOrdersTab: React.FC<AcceptedOrdersTabProps> = ({ orders, onMarkAsShipped }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No accepted orders</div>
        <div className="text-sm text-gray-400">
          Accepted orders will appear here
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
              <TableCell>
                <Badge className="bg-green-100 text-green-800">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                {order.status === 'accepted' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark Order as Shipped</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this order as shipped? 
                          This will notify the buyer that their order is on the way.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onMarkAsShipped(order.id)}>
                          Yes, Mark as Shipped
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AcceptedOrdersTab;
