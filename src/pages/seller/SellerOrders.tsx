import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import PendingOrdersTab from '@/components/seller/orders/PendingOrdersTab';
import AcceptedOrdersTab from '@/components/seller/orders/AcceptedOrdersTab';
import RejectedOrdersTab from '@/components/seller/orders/RejectedOrdersTab';
import AllOrdersTab from '@/components/seller/orders/AllOrdersTab';

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update orders",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      // Update local state immediately for better UX
      const previousOrders = [...orders];
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('seller_id', user.id)
        .select();

      if (error) {
        console.error('Error updating order:', error);
        
        // Revert local state on error
        setOrders(previousOrders);
        
        // Provide specific error messages
        if (error.message?.includes('RLS') || error.message?.includes('policy')) {
          toast({
            title: "Permission Error",
            description: "You don't have permission to update this order. Please contact support.",
            variant: "destructive"
          });
        } else if (error.message?.includes('not found')) {
          toast({
            title: "Order Not Found",
            description: "This order may have been deleted or you don't have access to it.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Update Failed",
            description: `Failed to update order status: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Order updated successfully:', data);

      toast({
        title: "Success",
        description: `Order ${newStatus} successfully`,
      });
    } catch (err) {
      console.error('Failed to update order:', err);
      
      // Revert local state on error
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: order.status } : order
        )
      );
      
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the order",
        variant: "destructive"
      });
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
  };

  const handleRejectOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected');
  };

  const handleMarkAsShipped = (orderId: string) => {
    updateOrderStatus(orderId, 'shipped');
  };

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

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
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Badge variant="outline">
          {orders.length} total orders
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted" className="relative">
            Accepted
            {acceptedOrders.length > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs">
                {acceptedOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            {rejectedOrders.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {rejectedOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingOrdersTab 
            orders={pendingOrders}
            onAcceptOrder={handleAcceptOrder}
            onRejectOrder={handleRejectOrder}
          />
        </TabsContent>

        <TabsContent value="accepted">
          <AcceptedOrdersTab 
            orders={acceptedOrders}
            onMarkAsShipped={handleMarkAsShipped}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <RejectedOrdersTab orders={rejectedOrders} />
        </TabsContent>

        <TabsContent value="all">
          <AllOrdersTab orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerOrders;
