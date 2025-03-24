
import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample stores data
const sampleStores: Store[] = [
  {
    id: 'sample-store-1',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png',
    category: 'Electronics',
    featured: true,
    dealCount: 15,
    url: 'https://amazon.com',
    storeType: 'online',
    country: 'Global',
    description: 'Online retailer with a wide range of products.'
  },
  {
    id: 'sample-store-2',
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
    category: 'Fashion',
    featured: true,
    dealCount: 8,
    url: 'https://nike.com',
    storeType: 'both',
    country: 'Global',
    description: 'Athletic footwear and apparel.'
  },
  {
    id: 'sample-store-3',
    name: 'Starbucks',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    category: 'Food & Dining',
    featured: false,
    dealCount: 5,
    url: 'https://starbucks.com',
    storeType: 'local',
    country: 'Global',
    description: 'Coffee chain with locations worldwide.'
  },
  {
    id: 'sample-store-4',
    name: 'Home Depot',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TheHomeDepot.svg/1200px-TheHomeDepot.svg.png',
    category: 'Home & Garden',
    featured: false,
    dealCount: 10,
    url: 'https://homedepot.com',
    storeType: 'both',
    country: 'USA',
    description: 'Home improvement and construction products retailer.'
  },
  {
    id: 'sample-store-5',
    name: 'Expedia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Expedia_2012_logo.svg/1200px-Expedia_2012_logo.svg.png',
    category: 'Travel',
    featured: true,
    dealCount: 12,
    url: 'https://expedia.com',
    storeType: 'online',
    country: 'Global',
    description: 'Online travel agency offering hotel reservations, airline tickets, and more.'
  }
];

export function useStores(options?: { 
  featured?: boolean, 
  category?: string,
  limit?: number,
  search?: string
}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        
        // Use explicit selection to avoid ambiguous column references
        let query = supabase
          .from('stores')
          .select('id, name, logo, category, featured, deal_count, url, store_type, country, description, created_at, updated_at');
        
        if (options?.featured) {
          query = query.eq('featured', true);
        }
        
        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.search) {
          query = query.ilike('name', `%${options.search}%`);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) throw error;

        if (data && data.length > 0) {
          // Map the database columns to our interface properties
          const mappedStores = data.map(store => ({
            id: store.id,
            name: store.name,
            logo: store.logo,
            category: store.category,
            featured: store.featured || false,
            dealCount: store.deal_count || 0,
            url: store.url,
            storeType: store.store_type as 'online' | 'local' | 'both' || 'online',
            country: store.country || undefined,
            description: store.description || undefined
          }));
          
          setStores(mappedStores);
        } else {
          // Use sample data if no data returned from the database
          let filteredStores = [...sampleStores];
          
          if (options?.featured) {
            filteredStores = filteredStores.filter(store => store.featured);
          }
          
          if (options?.category) {
            filteredStores = filteredStores.filter(store => store.category === options.category);
          }
          
          if (options?.search) {
            filteredStores = filteredStores.filter(store => 
              store.name.toLowerCase().includes(options.search!.toLowerCase())
            );
          }
          
          if (options?.limit) {
            filteredStores = filteredStores.slice(0, options.limit);
          }
          
          setStores(filteredStores);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
        // Fall back to sample data on error
        setStores(sampleStores);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [options?.featured, options?.category, options?.limit, options?.search]);

  return { stores, loading, error };
}

export function useStore(id: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        
        // Use explicit selection to avoid ambiguous column references
        const { data, error } = await supabase
          .from('stores')
          .select('id, name, logo, category, featured, deal_count, url, store_type, country, description, created_at, updated_at')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Map the database columns to our interface properties
          const mappedStore: Store = {
            id: data.id,
            name: data.name,
            logo: data.logo,
            category: data.category,
            featured: data.featured || false,
            dealCount: data.deal_count || 0,
            url: data.url,
            storeType: data.store_type as 'online' | 'local' | 'both' || 'online',
            country: data.country || undefined,
            description: data.description || undefined
          };
          
          setStore(mappedStore);
        } else {
          // Find a sample store if no data returned
          const sampleStore = sampleStores.find(s => s.id === id) || sampleStores[0];
          setStore(sampleStore);
        }
      } catch (err) {
        console.error('Error fetching store:', err);
        setError('Failed to load store');
        // Find a sample store as fallback
        const sampleStore = sampleStores.find(s => s.id === id) || sampleStores[0];
        setStore(sampleStore);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  return { store, loading, error };
}
