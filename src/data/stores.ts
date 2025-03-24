
import { Store } from "../types";

export const stores: Store[] = [
  {
    id: "1",
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    category: "general",
    featured: true,
    dealCount: 45,
    url: "#",
    storeType: "online",
    country: "United States",
    description: "Amazon is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence."
  },
  {
    id: "2",
    name: "Nike",
    logo: "https://logo.clearbit.com/nike.com",
    category: "fashion",
    featured: true,
    dealCount: 23,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Nike, Inc. is an American multinational corporation that designs, develops, manufactures, and sells footwear, apparel, equipment, accessories, and services."
  },
  {
    id: "3",
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    category: "electronics",
    featured: true,
    dealCount: 12,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services."
  },
  {
    id: "4",
    name: "Expedia",
    logo: "https://logo.clearbit.com/expedia.com",
    category: "travel",
    featured: true,
    dealCount: 18,
    url: "#",
    storeType: "online",
    country: "United States",
    description: "Expedia Group, Inc. is an American online travel shopping company for consumer and small business travel."
  },
  {
    id: "5",
    name: "H&M",
    logo: "https://logo.clearbit.com/hm.com",
    category: "fashion",
    dealCount: 29,
    url: "#",
    storeType: "both",
    country: "Sweden",
    description: "H&M is a Swedish multinational clothing retail company known for its fast-fashion clothing for men, women, teenagers, and children."
  },
  {
    id: "6",
    name: "Sephora",
    logo: "https://logo.clearbit.com/sephora.com",
    category: "beauty",
    featured: true,
    dealCount: 33,
    url: "#",
    storeType: "both",
    country: "France",
    description: "Sephora is a French multinational retailer of personal care and beauty products featuring nearly 3,000 brands."
  },
  {
    id: "7",
    name: "Best Buy",
    logo: "https://logo.clearbit.com/bestbuy.com",
    category: "electronics",
    dealCount: 27,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Best Buy is an American multinational consumer electronics retailer headquartered in Richfield, Minnesota."
  },
  {
    id: "8",
    name: "Uber Eats",
    logo: "https://logo.clearbit.com/ubereats.com",
    category: "food",
    dealCount: 15,
    url: "#",
    storeType: "online",
    country: "United States",
    description: "Uber Eats is an online food ordering and delivery platform launched by Uber in 2014."
  },
  {
    id: "9",
    name: "Ulta Beauty",
    logo: "https://logo.clearbit.com/ulta.com",
    category: "beauty",
    dealCount: 22,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Ulta Beauty is an American chain of beauty stores that carries cosmetics, skincare, fragrances, nail products, bath and body products, beauty tools, and haircare products."
  },
  {
    id: "10",
    name: "IKEA",
    logo: "https://logo.clearbit.com/ikea.com",
    category: "home",
    featured: true,
    dealCount: 19,
    url: "#",
    storeType: "both",
    country: "Sweden",
    description: "IKEA is a Swedish multinational conglomerate that designs and sells ready-to-assemble furniture, kitchen appliances and home accessories."
  },
  {
    id: "11",
    name: "Target",
    logo: "https://logo.clearbit.com/target.com",
    category: "general",
    featured: true,
    dealCount: 37,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Target Corporation is an American retail corporation operating a chain of department stores and discount stores across the United States."
  },
  {
    id: "12",
    name: "Macy's",
    logo: "https://logo.clearbit.com/macys.com",
    category: "fashion",
    dealCount: 31,
    url: "#",
    storeType: "both",
    country: "United States",
    description: "Macy's is an American department store chain founded in 1858 by Rowland Hussey Macy, operating 510 department stores in the US."
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
