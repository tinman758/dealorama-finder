
import { useState, useEffect } from 'react';
import { Deal, Store } from '@/types';
import { deals as staticDeals, stores as staticStores } from '@/data/staticData';

export function useSearchDeals(query: string) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchDeals = async () => {
      if (!query || query.length < 2) {
        setDeals([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const queryLower = query.toLowerCase();
        const matchedDeals = staticDeals.filter(deal => 
          deal.title.toLowerCase().includes(queryLower) || 
          deal.description.toLowerCase().includes(queryLower)
        );
        
        setDeals(matchedDeals);
      } catch (err) {
        console.error('Error searching deals:', err);
        setError('Failed to search deals');
      } finally {
        setLoading(false);
      }
    };

    searchDeals();
  }, [query]);

  return { deals, loading, error };
}

export function useSearchStores(query: string) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchStores = async () => {
      if (!query || query.length < 2) {
        setStores([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const queryLower = query.toLowerCase();
        const matchedStores = staticStores.filter(store => 
          store.name.toLowerCase().includes(queryLower) || 
          (store.description && store.description.toLowerCase().includes(queryLower))
        );
        
        setStores(matchedStores);
      } catch (err) {
        console.error('Error searching stores:', err);
        setError('Failed to search stores');
      } finally {
        setLoading(false);
      }
    };

    searchStores();
  }, [query]);

  return { stores, loading, error };
}
