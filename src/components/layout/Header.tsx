
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Marketplace</span>
          </Link>

          {/* Search Bar */}
          {user && (
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/messages">
                        <MessageCircle className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="relative" asChild>
                      <Link to="/cart">
                        <ShoppingCart className="w-4 h-4" />
                        {itemCount > 0 && (
                          <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                            {itemCount}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  </>
                )}
                
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/${user.role}/dashboard`}>
                      <User className="w-4 h-4 mr-2" />
                      {user.name}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
