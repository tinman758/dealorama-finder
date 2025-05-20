
import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { stores as staticStores } from '@/data/staticData';

export function useStores(options?: { 
  featured?: boolean, 
  category?: string,
  categoryId?: string,
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredStores = [...staticStores];
        
        if (options?.featured) {
          filteredStores = filteredStores.filter(store => store.featured);
        }
        
        if (options?.categoryId) {
          filteredStores = filteredStores.filter(store => store.categoryId === options.categoryId);
        } else if (options?.category) {
          filteredStores = filteredStores.filter(store => 
            store.category.toLowerCase() === options.category?.toLowerCase()
          );
        }
        
        if (options?.search) {
          const searchLower = options.search.toLowerCase();
          filteredStores = filteredStores.filter(store => 
            store.name.toLowerCase().includes(searchLower) || 
            (store.description && store.description.toLowerCase().includes(searchLower))
          );
        }
        
        // Sort alphabetically by name
        filteredStores.sort((a, b) => a.name.localeCompare(b.name));
        
        if (options?.limit) {
          filteredStores = filteredStores.slice(0, options.limit);
        }
        
        setStores(filteredStores);
      } catch (err: any) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [options?.featured, options?.category, options?.categoryId, options?.limit, options?.search]);

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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const foundStore = staticStores.find(store => store.id === id);
        
        if (foundStore) {
          setStore(foundStore);
        } else {
          setError('Store not found');
        }
      } catch (err: any) {
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
