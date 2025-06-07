import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Filter } from 'lucide-react';
import OrderCard from './OrderCard';

interface OrdersListProps {
  onOrderSelect: (orderId: string) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ onOrderSelect }) => {
  const { user } = useAuth();
  const { logUserActivity } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);

  const { data: initialOrders, isLoading, error, refetch } = useQuery({
    queryKey: ['buyer-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            price_per_item
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Set initial orders when data is loaded
  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
      // Log user activity
      logUserActivity('view_orders', 'User viewed their orders list');
    }
  }, [initialOrders, logUserActivity]);

  // Enhanced real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for buyer orders');
    
    const channel = supabase
      .channel('buyer-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time order update received:', payload);
          const updatedOrder = payload.new as any;
          
          // Update the orders state immediately
          setOrders(prev => {
            const updatedOrders = prev.map(order => {
              if (order.id === updatedOrder.id) {
                console.log(`Updating order ${order.id} status from ${order.status} to ${updatedOrder.status}`);
                // Log status change activity
                logUserActivity('order_status_changed', `Order ${order.id} status changed to ${updatedOrder.status}`);
                return { ...order, ...updatedOrder };
              }
              return order;
            });
            
            console.log('Updated orders state:', updatedOrders);
            return updatedOrders;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new as any;
          
          // Log new order activity
          logUserActivity('order_created', `New order ${newOrder.id} created`);
          
          // Fetch the complete order data with order_items
          const fetchCompleteOrder = async () => {
            const { data, error } = await supabase
              .from('orders')
              .select(`
                *,
                order_items (
                  id,
                  product_name,
                  product_image,
                  quantity,
                  price_per_item
                )
              `)
              .eq('id', newOrder.id)
              .single();
              
            if (!error && data) {
              setOrders(prev => [data, ...prev]);
            }
          };
          
          fetchCompleteOrder();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, logUserActivity]);

  // Force refresh orders when user focuses on the page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refreshing orders');
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_items?.some(item => 
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate = dateFilter === 'all' || (() => {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'week':
          return now.getTime() - orderDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case '3months':
          return now.getTime() - orderDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (!user) {
    return <div>Please log in to view your orders.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Error loading orders: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your order history</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => onOrderSelect(order.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'No orders match your filters.' 
                    : 'You haven\'t placed any orders yet.'
                  }
                </div>
                {(!searchTerm && statusFilter === 'all' && dateFilter === 'all') && (
                  <Button className="mt-4" onClick={() => window.location.href = '/products'}>
                    Start Shopping
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
