
import { Store } from "../types";

export const stores: Store[] = [
  {
    id: "1",
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    category: "general",
    featured: true,
    dealCount: 45,
    url: "#"
  },
  {
    id: "2",
    name: "Nike",
    logo: "https://logo.clearbit.com/nike.com",
    category: "fashion",
    featured: true,
    dealCount: 23,
    url: "#"
  },
  {
    id: "3",
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    category: "electronics",
    featured: true,
    dealCount: 12,
    url: "#"
  },
  {
    id: "4",
    name: "Expedia",
    logo: "https://logo.clearbit.com/expedia.com",
    category: "travel",
    featured: true,
    dealCount: 18,
    url: "#"
  },
  {
    id: "5",
    name: "H&M",
    logo: "https://logo.clearbit.com/hm.com",
    category: "fashion",
    dealCount: 29,
    url: "#"
  },
  {
    id: "6",
    name: "Sephora",
    logo: "https://logo.clearbit.com/sephora.com",
    category: "beauty",
    featured: true,
    dealCount: 33,
    url: "#"
  },
  {
    id: "7",
    name: "Best Buy",
    logo: "https://logo.clearbit.com/bestbuy.com",
    category: "electronics",
    dealCount: 27,
    url: "#"
  },
  {
    id: "8",
    name: "Uber Eats",
    logo: "https://logo.clearbit.com/ubereats.com",
    category: "food",
    dealCount: 15,
    url: "#"
  },
  {
    id: "9",
    name: "Ulta Beauty",
    logo: "https://logo.clearbit.com/ulta.com",
    category: "beauty",
    dealCount: 22,
    url: "#"
  },
  {
    id: "10",
    name: "IKEA",
    logo: "https://logo.clearbit.com/ikea.com",
    category: "home",
    featured: true,
    dealCount: 19,
    url: "#"
  },
  {
    id: "11",
    name: "Target",
    logo: "https://logo.clearbit.com/target.com",
    category: "general",
    featured: true,
    dealCount: 37,
    url: "#"
  },
  {
    id: "12",
    name: "Macy's",
    logo: "https://logo.clearbit.com/macys.com",
    category: "fashion",
    dealCount: 31,
    url: "#"
  }
];

export const getFeaturedStores = (): Store[] => {
  return stores.filter(store => store.featured);
};

export const getStoreById = (id: string): Store | undefined => {
  return stores.find(store => store.id === id);
};

export const getStoresByCategory = (category: string): Store[] => {
  return stores.filter(store => store.category === category);
};

export const searchStores = (query: string): Store[] => {
  const lowerCaseQuery = query.toLowerCase();
  return stores.filter(store => 
    store.name.toLowerCase().includes(lowerCaseQuery)
  );
};
