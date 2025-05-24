
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'buyer' | 'seller' | 'admin') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('ecommerce_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'buyer' | 'seller' | 'admin') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36),
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('ecommerce_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: 'buyer' | 'seller') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('ecommerce_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecommerce_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
