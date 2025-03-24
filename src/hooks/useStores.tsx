
import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample store data
const sampleStores: Store[] = [
  {
    id: "1",
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    category: "Fashion",
    featured: true,
    dealCount: 12,
    url: "https://www.nike.com",
    storeType: "both",
    country: "United States",
    description: "Nike, Inc. is an American multinational corporation that designs, develops, manufactures, and markets footwear, apparel, equipment, and accessories worldwide."
  },
  {
    id: "2",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    category: "Electronics",
    featured: true,
    dealCount: 25,
    url: "https://www.amazon.com",
    storeType: "online",
    country: "United States",
    description: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence."
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

        // Map the database columns to our interface properties
        const mappedStores = (data || []).map(store => ({
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
        
        // Return the mapped stores, or sample data if no stores were found
        setStores(mappedStores.length > 0 ? mappedStores : sampleStores);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
        // Return sample data if there was an error
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
        
        // Map the database columns to our interface properties
        if (data) {
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
          // Find the store in sample data if not found in database
          const sampleStore = sampleStores.find(s => s.id === id);
          if (sampleStore) {
            setStore(sampleStore);
          }
        }
      } catch (err) {
        console.error('Error fetching store:', err);
        setError('Failed to load store');
        
        // Find the store in sample data if there was an error
        const sampleStore = sampleStores.find(s => s.id === id);
        if (sampleStore) {
          setStore(sampleStore);
        }
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
