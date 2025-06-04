
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OrdersList from '@/components/buyer/orders/OrdersList';
import OrderDetailView from '@/components/buyer/orders/OrderDetailView';

const BuyerOrdersPage = () => {
  const { user } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Please log in to view your orders.</div>
      </div>
    );
  }

  if (selectedOrderId) {
    return (
      <OrderDetailView 
        orderId={selectedOrderId} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  return (
    <OrdersList onOrderSelect={setSelectedOrderId} />
  );
};

export default BuyerOrdersPage;
