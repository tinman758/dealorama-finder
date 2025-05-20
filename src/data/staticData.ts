
import { Store, Deal, Category } from '@/types';

// Sample categories data
export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '💻' },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👚' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', icon: '🏠' },
  { id: '4', name: 'Health & Beauty', slug: 'health-beauty', icon: '💄' },
  { id: '5', name: 'Travel', slug: 'travel', icon: '✈️' },
  { id: '6', name: 'Food & Dining', slug: 'food-dining', icon: '🍔' },
  { id: '7', name: 'Entertainment', slug: 'entertainment', icon: '🎬' },
  { id: '8', name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: '⚽' }
];

// Sample stores data
export const stores: Store[] = [
  {
    id: '1',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    category: 'Electronics',
    categoryId: '1',
    featured: true,
    dealCount: 15,
    url: 'https://amazon.com',
    storeType: 'online',
    country: 'United States',
    description: 'The largest online retailer offering millions of products.'
  },
  {
    id: '2',
    name: 'Nike',
    logo: 'https://logo.clearbit.com/nike.com',
    category: 'Fashion',
    categoryId: '2',
    featured: true,
    dealCount: 8,
    url: 'https://nike.com',
    storeType: 'both',
    country: 'United States',
    description: 'Global sports and fashion brand offering athletic clothing and footwear.'
  },
  {
    id: '3',
    name: 'Best Buy',
    logo: 'https://logo.clearbit.com/bestbuy.com',
    category: 'Electronics',
    categoryId: '1',
    featured: true,
    dealCount: 10,
    url: 'https://bestbuy.com',
    storeType: 'both',
    country: 'United States',
    description: 'Consumer electronics retailer offering computers, appliances, and more.'
  },
  {
    id: '4',
    name: 'IKEA',
    logo: 'https://logo.clearbit.com/ikea.com',
    category: 'Home & Garden',
    categoryId: '3',
    featured: false,
    dealCount: 5,
    url: 'https://ikea.com',
    storeType: 'both',
    country: 'Global',
    description: 'Furniture retailer offering modern, affordable home furnishings.'
  },
  {
    id: '5',
    name: 'Sephora',
    logo: 'https://logo.clearbit.com/sephora.com',
    category: 'Health & Beauty',
    categoryId: '4',
    featured: true,
    dealCount: 7,
    url: 'https://sephora.com',
    storeType: 'both',
    country: 'United States',
    description: 'Beauty retailer offering makeup, skincare, and fragrance products.'
  }
];

// Sample deals data
export const deals: Deal[] = [
  {
    id: '1',
    title: '20% Off Electronics',
    description: 'Get 20% off on all electronics this weekend',
    discount: '20% OFF',
    storeId: '1',
    verified: true,
    featured: true,
    url: 'https://amazon.com/deals',
    category: 'Electronics',
    usedCount: 1245,
    type: 'link',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: '$30 Off Nike Shoes',
    description: 'Use code SHOES30 for $30 off any pair of shoes',
    code: 'SHOES30',
    discount: '$30 OFF',
    storeId: '2',
    verified: true,
    featured: true,
    url: 'https://nike.com/deals',
    category: 'Fashion',
    usedCount: 987,
    type: 'code',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Free Shipping on Orders Over $50',
    description: 'Get free shipping on all orders over $50',
    discount: 'FREE SHIPPING',
    storeId: '3',
    verified: true,
    featured: true,
    url: 'https://bestbuy.com/deals',
    category: 'Electronics',
    usedCount: 756,
    type: 'link',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Buy One Get One Free',
    description: 'Buy one item and get another of equal or lesser value for free',
    code: 'BOGO2024',
    discount: 'BOGO',
    storeId: '4',
    verified: true,
    featured: false,
    url: 'https://ikea.com/deals',
    category: 'Home & Garden',
    usedCount: 532,
    type: 'code',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: '15% Off Beauty Products',
    description: 'Get 15% off on all beauty products with code BEAUTY15',
    code: 'BEAUTY15',
    discount: '15% OFF',
    storeId: '5',
    verified: true,
    featured: true,
    url: 'https://sephora.com/deals',
    category: 'Health & Beauty',
    usedCount: 1098,
    type: 'code',
    expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    title: 'Echo Dot 5th Gen',
    description: 'Latest Echo Dot with improved sound and features',
    discount: '40% OFF',
    storeId: '1',
    verified: true,
    featured: true,
    url: 'https://amazon.com/echo-dot',
    category: 'Electronics',
    usedCount: 432,
    type: 'product',
    price: '$29.99',
    originalPrice: '$49.99',
    productImage: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg'
  }
];

// Mock user data for static authentication
export const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Admin User',
    isAdmin: true
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    isAdmin: false
  }
];

// Mock favorites data
export const favorites = [
  { id: '1', userId: '2', dealId: '1' },
  { id: '2', userId: '2', dealId: '3' }
];
