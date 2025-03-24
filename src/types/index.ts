
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
  type?: 'code' | 'link' | 'product'; // Add deal type
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
