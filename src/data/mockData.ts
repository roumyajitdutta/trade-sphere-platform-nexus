
import { Product, Order } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    originalPrice: 399.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    sellerId: 'seller2',
    sellerName: 'Fashion Forward',
    title: 'Designer Laptop Bag',
    description: 'Elegant leather laptop bag perfect for professionals.',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    category: 'Fashion',
    stock: 8,
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    price: 199.99,
    originalPrice: 249.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    category: 'Electronics',
    stock: 22,
    rating: 4.7,
    reviewCount: 203,
    createdAt: '2024-01-17T00:00:00Z',
  },
  {
    id: '4',
    sellerId: 'seller3',
    sellerName: 'Home Essentials',
    title: 'Ceramic Coffee Mug Set',
    description: 'Beautiful handcrafted ceramic mugs, set of 4.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400'],
    category: 'Home & Garden',
    stock: 35,
    rating: 4.9,
    reviewCount: 67,
    createdAt: '2024-01-18T00:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'order1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    products: [
      {
        productId: '1',
        product: mockProducts[0],
        quantity: 1,
        price: 299.99,
      },
    ],
    total: 299.99,
    status: 'shipped',
    shippingAddress: '123 Main St, City, State 12345',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];
