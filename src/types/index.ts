
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: {
    productId: string;
    product: Product;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  orderId?: string;
  productId?: string;
  content: string;
  createdAt: string;
  read: boolean;
}
