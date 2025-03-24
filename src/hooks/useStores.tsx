
import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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
        let query = supabase.from('stores').select('*');
        
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
        
        setStores(mappedStores);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
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
        
        const { data, error } = await supabase
          .from('stores')
          .select('*')
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
        }
      } catch (err) {
        console.error('Error fetching store:', err);
        setError('Failed to load store');
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
