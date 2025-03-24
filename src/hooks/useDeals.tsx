
import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample deals data
const sampleDeals: Deal[] = [
  // Nike Deal with Code Type
  {
    id: "1",
    title: "20% Off Nike Running Shoes",
    description: "Get 20% off on all Nike running shoes with this exclusive promo code.",
    code: "NIKE20RUN",
    discount: "20% Off",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    storeId: "1", // Nike's ID
    verified: true,
    featured: true,
    url: "https://www.nike.com/running",
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-3-road-running-shoes.png",
    category: "Fashion",
    usedCount: 245,
    type: "code"
  },
  // Amazon Deal with Link Type
  {
    id: "2",
    title: "Amazon Echo Dot - $20 Off",
    description: "Amazon Echo Dot (5th Gen) now available at a discounted price. Limited time offer.",
    discount: "$20 Off",
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    storeId: "2", // Amazon's ID
    verified: true,
    featured: true,
    url: "https://www.amazon.com/dp/B09B8V1LZ3",
    image: "https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_SL1000_.jpg",
    category: "Electronics",
    usedCount: 189,
    type: "link"
  },
  // Amazon Deal with Product Type
  {
    id: "3",
    title: "Fire TV Stick 4K",
    description: "Stream in 4K resolution with the all-new Fire TV Stick 4K. Now with enhanced Wi-Fi and Alexa Voice Remote.",
    discount: "Save 25%",
    price: "$37.49",
    originalPrice: "$49.99",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    storeId: "2", // Amazon's ID
    verified: true,
    featured: true,
    url: "https://www.amazon.com/dp/B08XVYZ1Y5",
    productImage: "https://m.media-amazon.com/images/I/51CgKGfMelL._AC_SL1000_.jpg",
    category: "Electronics",
    usedCount: 320,
    type: "product"
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
        
        // Map the database columns to our interface properties
        const mappedDeals = (data || []).map(deal => ({
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
        
        // Filter sample deals based on options if no database results
        let filteredSampleDeals = [...sampleDeals];
        
        if (options?.storeId) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.storeId === options.storeId);
        }
        
        if (options?.category) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.category === options.category);
        }
        
        if (options?.featured) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.featured);
        }
        
        if (options?.type) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.type === options.type);
        }
        
        if (options?.search) {
          const searchLower = options.search.toLowerCase();
          filteredSampleDeals = filteredSampleDeals.filter(deal => 
            deal.title.toLowerCase().includes(searchLower) || 
            deal.description.toLowerCase().includes(searchLower)
          );
        }
        
        if (options?.limit && filteredSampleDeals.length > options.limit) {
          filteredSampleDeals = filteredSampleDeals.slice(0, options.limit);
        }
        
        setDeals(mappedDeals.length > 0 ? mappedDeals : filteredSampleDeals);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals');
        
        // Filter sample deals based on options if there was an error
        let filteredSampleDeals = [...sampleDeals];
        
        if (options?.storeId) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.storeId === options.storeId);
        }
        
        if (options?.category) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.category === options.category);
        }
        
        if (options?.featured) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.featured);
        }
        
        if (options?.type) {
          filteredSampleDeals = filteredSampleDeals.filter(deal => deal.type === options.type);
        }
        
        setDeals(filteredSampleDeals);
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
        
        // Map the database columns to our interface properties
        if (data) {
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
          // Find the deal in sample data if not found in database
          const sampleDeal = sampleDeals.find(d => d.id === id);
          if (sampleDeal) {
            setDeal(sampleDeal);
          }
        }
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError('Failed to load deal');
        
        // Find the deal in sample data if there was an error
        const sampleDeal = sampleDeals.find(d => d.id === id);
        if (sampleDeal) {
          setDeal(sampleDeal);
        }
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
