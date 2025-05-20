
import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { deals as staticDeals } from '@/data/staticData';

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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredDeals = [...staticDeals];
        
        if (options?.featured) {
          filteredDeals = filteredDeals.filter(deal => deal.featured);
        }
        
        if (options?.storeId) {
          filteredDeals = filteredDeals.filter(deal => deal.storeId === options.storeId);
        }
        
        if (options?.category) {
          filteredDeals = filteredDeals.filter(deal => deal.category.toLowerCase() === options.category?.toLowerCase());
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
        
        // Sort by newest first (assuming id correlates with creation time in our static data)
        filteredDeals.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        
        if (options?.limit) {
          filteredDeals = filteredDeals.slice(0, options.limit);
        }
        
        setDeals(filteredDeals);
      } catch (err: any) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals');
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const foundDeal = staticDeals.find(deal => deal.id === id);
        
        if (foundDeal) {
          setDeal(foundDeal);
        } else {
          setError('Deal not found');
        }
      } catch (err: any) {
        console.error('Error fetching deal:', err);
        setError('Failed to load deal');
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
