
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
import { toast } from '@/hooks/use-toast';
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

const SellerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchOrders();

    // Subscribe to real-time order updates
    const channel = supabase
      .channel('seller-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new as Order;
          setOrders(prev => [newOrder, ...prev]);
          
          // Show toast notification
          toast({
            title: "New Order Received!",
            description: `Order for $${newOrder.total} has been placed`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          const updatedOrder = payload.new as Order;
          setOrders(prev => 
            prev.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        });
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('seller_id', user?.id);

      if (error) {
        console.error('Error updating order:', error);
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
        return;
      }

      // Create notification for buyer
      const order = orders.find(o => o.id === orderId);
      if (order) {
        try {
          await supabase
            .from('notifications' as any)
            .insert({
              user_id: order.buyer_id,
              type: status === 'accepted' ? 'order_accepted' : 'order_rejected',
              title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              message: `Your order for $${order.total} has been ${status}`,
              order_id: orderId
            });
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
          // Don't fail the whole operation if notification fails
        }
      }

      toast({
        title: "Success",
        description: `Order ${status} successfully`,
      });
    } catch (err) {
      console.error('Failed to update order:', err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Badge variant="outline">
          {orders.length} total orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No orders yet</div>
          <div className="text-sm text-gray-400">
            Orders will appear here when customers place them
          </div>
        </div>
      ) : (
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
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
