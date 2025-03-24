
export interface Deal {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount: string;
  expiryDate?: string;
  storeId: string;
  verified: boolean;
  featured?: boolean;
  url: string;
  image?: string;
  category: string;
  usedCount?: number;
  type?: 'code' | 'link' | 'product'; // Deal type
  price?: string;           // For product deals
  originalPrice?: string;   // For product deals
  productImage?: string;    // For product deals
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  category: string;
  featured?: boolean;
  dealCount: number;
  url: string;
  storeType?: 'online' | 'local' | 'both';  // Whether the store is online, local, or both
  country?: string;         // Country where the store operates
  description?: string;     // Brief description of the store
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
