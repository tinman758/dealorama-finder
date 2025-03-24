
import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample deals data with different types: code, link, and product
const sampleDeals: Deal[] = [
  // Code deal (coupon)
  {
    id: 'sample-deal-1',
    title: '20% Off All Electronics',
    description: 'Use this code to get 20% off all electronics at Amazon.',
    code: 'TECH20',
    discount: '20% OFF',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    storeId: 'sample-store-1', // Amazon
    verified: true,
    featured: true,
    url: 'https://amazon.com/electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070',
    category: 'Electronics',
    usedCount: 342,
    type: 'code'
  },
  // Link deal (direct deal)
  {
    id: 'sample-deal-2',
    title: 'Free Shipping on Orders Over $50',
    description: 'Get free shipping on all orders over $50 at Nike.',
    discount: 'Free Shipping',
    storeId: 'sample-store-2', // Nike
    verified: true,
    featured: false,
    url: 'https://nike.com',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070',
    category: 'Fashion',
    usedCount: 156,
    type: 'link'
  },
  // Product deal (specific product)
  {
    id: 'sample-deal-3',
    title: 'Coffee Maker on Sale',
    description: 'Starbucks signature coffee maker now at a special price.',
    discount: '40% OFF',
    storeId: 'sample-store-3', // Starbucks
    verified: true,
    featured: true,
    url: 'https://starbucks.com/shop/coffee-makers',
    image: 'https://images.unsplash.com/photo-1606937898591-4b79dd525a68?q=80&w=2070',
    category: 'Food & Dining',
    usedCount: 89,
    type: 'product',
    price: '$59.99',
    originalPrice: '$99.99',
    productImage: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=2070'
  },
  // Garden tools deal
  {
    id: 'sample-deal-4',
    title: 'Garden Tools Bundle',
    description: 'Complete garden tools set at a special price.',
    code: 'GARDEN25',
    discount: '25% OFF',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    storeId: 'sample-store-4', // Home Depot
    verified: true,
    featured: false,
    url: 'https://homedepot.com/garden',
    image: 'https://images.unsplash.com/photo-1566880984801-5938cefb8702?q=80&w=2070',
    category: 'Home & Garden',
    usedCount: 75,
    type: 'code'
  },
  // Travel vacation package deal
  {
    id: 'sample-deal-5',
    title: 'Summer Vacation Package',
    description: 'Book your summer vacation with 30% discount.',
    code: 'SUMMER30',
    discount: '30% OFF',
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    storeId: 'sample-store-5', // Expedia
    verified: true,
    featured: true,
    url: 'https://expedia.com/summer',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073',
    category: 'Travel',
    usedCount: 210,
    type: 'code'
  }
];

export function useDeals(options?: { 
  featured?: boolean, 
  storeId?: string,
  category?: string,
  type?: 'code' | 'link' | 'product',
  search?: string,
  limit?: number
}) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('deals')
          .select(`
            id, 
            title, 
            description, 
            code, 
            discount, 
            expiry_date, 
            store_id, 
            verified, 
            featured, 
            url, 
            image, 
            category, 
            used_count, 
            type, 
            price, 
            original_price, 
            product_image, 
            created_at, 
            updated_at
          `);
        
        if (options?.featured) {
          query = query.eq('featured', true);
        }
        
        if (options?.storeId) {
          query = query.eq('store_id', options.storeId);
        }
        
        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.type) {
          query = query.eq('type', options.type);
        }
        
        if (options?.search) {
          query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map the database columns to our interface properties
          const mappedDeals = data.map(deal => ({
            id: deal.id,
            title: deal.title,
            description: deal.description,
            code: deal.code || undefined,
            discount: deal.discount,
            expiryDate: deal.expiry_date || undefined,
            storeId: deal.store_id,
            verified: deal.verified || false,
            featured: deal.featured || false,
            url: deal.url,
            image: deal.image || undefined,
            category: deal.category,
            usedCount: deal.used_count || 0,
            type: deal.type as 'code' | 'link' | 'product' || 'code',
            price: deal.price || undefined,
            originalPrice: deal.original_price || undefined,
            productImage: deal.product_image || undefined
          }));
          
          setDeals(mappedDeals);
        } else {
          // Use sample data if no data returned from the database
          let filteredDeals = [...sampleDeals];
          
          if (options?.featured) {
            filteredDeals = filteredDeals.filter(deal => deal.featured);
          }
          
          if (options?.storeId) {
            filteredDeals = filteredDeals.filter(deal => deal.storeId === options.storeId);
          }
          
          if (options?.category) {
            filteredDeals = filteredDeals.filter(deal => deal.category === options.category);
          }
          
          if (options?.type) {
            filteredDeals = filteredDeals.filter(deal => deal.type === options.type);
          }
          
          if (options?.search) {
            const searchLower = options.search.toLowerCase();
            filteredDeals = filteredDeals.filter(deal => 
              deal.title.toLowerCase().includes(searchLower) || 
              deal.description.toLowerCase().includes(searchLower)
            );
          }
          
          if (options?.limit) {
            filteredDeals = filteredDeals.slice(0, options.limit);
          }
          
          setDeals(filteredDeals);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals');
        // Fall back to sample data on error
        setDeals(sampleDeals);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [options?.featured, options?.storeId, options?.category, options?.type, options?.search, options?.limit]);

  return { deals, loading, error };
}

export function useDeal(id: string) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('deals')
          .select(`
            id, 
            title, 
            description, 
            code, 
            discount, 
            expiry_date, 
            store_id, 
            verified, 
            featured, 
            url, 
            image, 
            category, 
            used_count, 
            type, 
            price, 
            original_price, 
            product_image, 
            created_at, 
            updated_at
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Map the database columns to our interface properties
          const mappedDeal: Deal = {
            id: data.id,
            title: data.title,
            description: data.description,
            code: data.code || undefined,
            discount: data.discount,
            expiryDate: data.expiry_date || undefined,
            storeId: data.store_id,
            verified: data.verified || false,
            featured: data.featured || false,
            url: data.url,
            image: data.image || undefined,
            category: data.category,
            usedCount: data.used_count || 0,
            type: data.type as 'code' | 'link' | 'product' || 'code',
            price: data.price || undefined,
            originalPrice: data.original_price || undefined,
            productImage: data.product_image || undefined
          };
          
          setDeal(mappedDeal);
        } else {
          // Find a sample deal if no data returned
          const sampleDeal = sampleDeals.find(d => d.id === id) || sampleDeals[0];
          setDeal(sampleDeal);
        }
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError('Failed to load deal');
        // Find a sample deal as fallback
        const sampleDeal = sampleDeals.find(d => d.id === id) || sampleDeals[0];
        setDeal(sampleDeal);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeal();
    }
  }, [id]);

  return { deal, loading, error };
}
