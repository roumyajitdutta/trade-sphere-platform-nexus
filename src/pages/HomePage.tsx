
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Store, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ProductGrid from '@/components/products/ProductGrid';
import { mockProducts } from '@/data/mockData';

const HomePage = () => {
  const { user } = useAuth();

  const featuredProducts = mockProducts.filter(p => p.featured);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Premier
              <span className="text-blue-600 block">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect buyers and sellers in a secure, feature-rich platform. 
              Buy amazing products or start selling your own today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link to="/register">
                  Start Shopping
                  <ShoppingCart className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
                <Link to="/register">
                  Become a Seller
                  <Store className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-lg text-gray-600">
              Built for modern commerce with powerful features for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Easy Shopping</h3>
                <p className="text-gray-600">
                  Browse thousands of products, compare prices, and shop with confidence
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Store className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sell Anything</h3>
                <p className="text-gray-600">
                  List your products, manage orders, and grow your business online
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure & Safe</h3>
                <p className="text-gray-600">
                  Protected transactions, dispute resolution, and trusted community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of buyers and sellers already using our platform
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
              <Link to="/register">
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-blue-100">
          {user.role === 'buyer' 
            ? 'Discover amazing products from trusted sellers'
            : user.role === 'seller'
            ? 'Manage your store and grow your business'
            : 'Monitor platform activity and moderate content'
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {user.role === 'buyer' && (
          <>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Browse Products</h3>
                <p className="text-gray-600 text-sm">Explore our marketplace</p>
              </CardContent>
            </Card>
            
            <Link to="/buyer/orders" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-semibold">📦</span>
                  </div>
                  <h3 className="font-semibold mb-2">My Orders</h3>
                  <p className="text-gray-600 text-sm">Track your purchases</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/cart" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-semibold">🛒</span>
                  </div>
                  <h3 className="font-semibold mb-2">My Cart</h3>
                  <p className="text-gray-600 text-sm">Review items to buy</p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        
        {user.role === 'seller' && (
          <>
            <Link to="/seller/products" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-semibold">📦</span>
                  </div>
                  <h3 className="font-semibold mb-2">My Products</h3>
                  <p className="text-gray-600 text-sm">Manage your inventory</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/seller/orders" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-semibold">📋</span>
                  </div>
                  <h3 className="font-semibold mb-2">Orders</h3>
                  <p className="text-gray-600 text-sm">Process customer orders</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/seller/analytics" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-semibold">📊</span>
                  </div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-gray-600 text-sm">View sales performance</p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <Link to="/admin/users" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-semibold">👥</span>
                  </div>
                  <h3 className="font-semibold mb-2">Users</h3>
                  <p className="text-gray-600 text-sm">Manage platform users</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/products" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-semibold">🛍️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Products</h3>
                  <p className="text-gray-600 text-sm">Moderate listings</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/analytics" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-semibold">📈</span>
                  </div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-gray-600 text-sm">Platform insights</p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductGrid products={featuredProducts} title="Featured Products" />
      )}
    </div>
  );
};

export default HomePage;
