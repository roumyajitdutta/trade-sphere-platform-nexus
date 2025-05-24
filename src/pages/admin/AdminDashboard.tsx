
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProducts, mockOrders } from '@/data/mockData';

const AdminDashboard = () => {
  const totalUsers = 1250; // Mock data
  const totalProducts = mockProducts.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform activity and manage users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-green-600">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
          <Link to="/admin/users">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Manage Users</h3>
              <p className="text-gray-600 text-sm">View and moderate users</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
          <Link to="/admin/products">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm">Moderate listings</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
          <Link to="/admin/analytics">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Platform insights</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
          <Link to="/admin/disputes">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Disputes</h3>
              <p className="text-gray-600 text-sm">Handle conflicts</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">User {i + 1}</p>
                      <p className="text-sm text-gray-600">
                        {i % 2 === 0 ? 'Buyer' : 'Seller'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users</span>
                <span className="text-green-600 font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Seller Satisfaction</span>
                <span className="text-green-600 font-semibold">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Order Success Rate</span>
                <span className="text-green-600 font-semibold">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Open Disputes</span>
                <span className="text-orange-600 font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
