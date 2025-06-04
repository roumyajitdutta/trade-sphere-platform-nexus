
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileOverview from '@/components/buyer/ProfileOverview';
import ShippingAddresses from '@/components/buyer/ShippingAddresses';
import PaymentMethods from '@/components/buyer/PaymentMethods';
import AccountSecurity from '@/components/buyer/AccountSecurity';

const BuyerDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Please log in to access your dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your profile, addresses, payments, and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview - Full width on mobile, half on large screens */}
          <div className="lg:col-span-2">
            <ProfileOverview />
          </div>

          {/* Shipping Addresses */}
          <div>
            <ShippingAddresses />
          </div>

          {/* Payment Methods */}
          <div>
            <PaymentMethods />
          </div>

          {/* Account Security - Full width */}
          <div className="lg:col-span-2">
            <AccountSecurity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
