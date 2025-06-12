
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import SearchBar from '@/components/search/SearchBar';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const getUserRole = () => {
    return user?.user_metadata?.role || 'buyer';
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">Marketplace</span>
          </Link>

          {/* Search Bar */}
          {user && (
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <SearchBar />
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <ThemeToggle />
            
            {user ? (
              <>
                {getUserRole() === 'buyer' && (
                  <>
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
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
                
                <NotificationBell />
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild className="hidden lg:flex">
                    <Link to={`/${getUserRole()}/dashboard`}>
                      <User className="w-4 h-4 mr-2" />
                      {getUserName()}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="lg:hidden">
                    <Link to={`/${getUserRole()}/dashboard`}>
                      <User className="w-4 h-4" />
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
