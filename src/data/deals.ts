import { Deal } from "../types";

export const deals: Deal[] = [
  {
    id: "1",
    title: "20% Off Sitewide",
    description: "Save 20% on all purchases with this special promo code.",
    code: "SAVE20",
    discount: "20% OFF",
    expiryDate: "2023-12-31",
    storeId: "1",
    verified: true,
    featured: true,
    url: "#",
    category: "fashion",
    usedCount: 458,
    type: "code"
  },
  {
    id: "2",
    title: "Free Shipping on Orders Over $50",
    description: "Get free shipping on all orders over $50. No code required.",
    discount: "FREE SHIPPING",
    expiryDate: "2023-12-25",
    storeId: "2",
    verified: true,
    featured: true,
    url: "#",
    category: "electronics",
    usedCount: 325,
    type: "link"
  },
  {
    id: "3",
    title: "Buy One Get One 50% Off",
    description: "Purchase any item and get the second item at 50% off the regular price.",
    code: "BOGO50",
    discount: "BOGO 50% OFF",
    expiryDate: "2023-12-20",
    storeId: "3",
    verified: true,
    url: "#",
    category: "home",
    usedCount: 287,
    type: "code"
  },
  {
    id: "4",
    title: "$25 Off Orders Over $100",
    description: "Save $25 when you spend $100 or more with this coupon code.",
    code: "SAVE25",
    discount: "$25 OFF",
    expiryDate: "2023-12-15",
    storeId: "4",
    verified: true,
    featured: true,
    url: "#",
    category: "travel",
    usedCount: 189,
    type: "code"
  },
  {
    id: "5",
    title: "30% Off Selected Items",
    description: "Get 30% off select items in our clearance section.",
    code: "CLEAR30",
    discount: "30% OFF",
    expiryDate: "2023-12-10",
    storeId: "5",
    verified: true,
    url: "#",
    category: "fashion",
    usedCount: 276,
    type: "code"
  },
  {
    id: "6",
    title: "10% Off Your First Order",
    description: "New customers save 10% on their first purchase.",
    code: "FIRST10",
    discount: "10% OFF",
    expiryDate: "2023-12-31",
    storeId: "6",
    verified: true,
    url: "#",
    category: "beauty",
    usedCount: 153,
    type: "code"
  },
  {
    id: "7",
    title: "15% Student Discount",
    description: "Students get 15% off with verified student email.",
    discount: "15% OFF",
    storeId: "7",
    verified: true,
    url: "#",
    category: "electronics",
    usedCount: 421,
    type: "link"
  },
  {
    id: "8",
    title: "$10 Off When You Sign Up",
    description: "Sign up for our newsletter and receive $10 off your next purchase.",
    discount: "$10 OFF",
    expiryDate: "2023-12-31",
    storeId: "8",
    verified: true,
    url: "#",
    category: "food",
    usedCount: 176,
    type: "link"
  },
  {
    id: "9",
    title: "Buy 2, Get 1 Free",
    description: "Purchase any two items and receive a third item of equal or lesser value for free.",
    discount: "B2G1 FREE",
    expiryDate: "2023-12-20",
    storeId: "9",
    verified: true,
    featured: true,
    url: "#",
    category: "beauty",
    usedCount: 285,
    type: "link"
  },
  {
    id: "10",
    title: "50% Off Clearance Items",
    description: "Save 50% on all clearance items while supplies last.",
    discount: "50% OFF",
    expiryDate: "2023-12-15",
    storeId: "10",
    verified: true,
    url: "#",
    category: "home",
    usedCount: 329,
    type: "link"
  },
  {
    id: "11",
    title: "Free Gift with Purchase",
    description: "Receive a free gift with any purchase of $75 or more.",
    discount: "FREE GIFT",
    expiryDate: "2023-12-25",
    storeId: "1",
    verified: true,
    url: "#",
    category: "beauty",
    usedCount: 198,
    type: "link"
  },
  {
    id: "12",
    title: "Up to 70% Off Summer Sale",
    description: "Shop our summer sale and save up to 70% on selected items.",
    discount: "UP TO 70% OFF",
    expiryDate: "2023-12-31",
    storeId: "2",
    verified: true,
    featured: true,
    url: "#",
    category: "fashion",
    usedCount: 476,
    type: "link"
  },
  {
    id: "13",
    title: "Apple AirPods Pro (2nd Generation)",
    description: "Experience the magic of AirPods Pro with Active Noise Cancellation, Transparency mode, and Spatial Audio.",
    discount: "20% OFF",
    expiryDate: "2023-12-31",
    storeId: "3",
    verified: true,
    featured: true,
    url: "#",
    category: "electronics",
    usedCount: 342,
    type: "product",
    price: "$199.99",
    originalPrice: "$249.99",
    productImage: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=600&fit=crop"
  },
  {
    id: "14",
    title: "Samsung 65-inch QLED 4K Smart TV",
    description: "Experience stunning 4K resolution and Quantum Dot technology for incredible color and contrast.",
    discount: "$300 OFF",
    expiryDate: "2023-12-25",
    storeId: "7",
    verified: true,
    url: "#",
    category: "electronics",
    usedCount: 215,
    type: "product",
    price: "$999.99",
    originalPrice: "$1,299.99",
    productImage: "https://images.unsplash.com/photo-1593784991095-a205069533cd?w=800&h=600&fit=crop"
  },
  {
    id: "15",
    title: "Nike Air Max 270 Running Shoes",
    description: "Stylish and comfortable running shoes with Nike's largest Air unit yet for soft cushioning.",
    discount: "30% OFF",
    expiryDate: "2023-12-20",
    storeId: "2",
    verified: true,
    url: "#",
    category: "fashion",
    usedCount: 427,
    type: "product",
    price: "$105.97",
    originalPrice: "$150.00",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
  }
];

export const getFeaturedDeals = (): Deal[] => {
  return deals.filter(deal => deal.featured);
};

export const getDealsForStore = (storeId: string): Deal[] => {
  return deals.filter(deal => deal.storeId === storeId);
};

export const getDealsForCategory = (category: string): Deal[] => {
  return deals.filter(deal => deal.category === category);
};

export const getDealById = (id: string): Deal | undefined => {
  return deals.find(deal => deal.id === id);
};

export const searchDeals = (query: string): Deal[] => {
  const lowerCaseQuery = query.toLowerCase();
  return deals.filter(
    deal => 
      deal.title.toLowerCase().includes(lowerCaseQuery) || 
      deal.description.toLowerCase().includes(lowerCaseQuery)
  );
};
