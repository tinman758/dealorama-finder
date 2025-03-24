
import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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
        let query = supabase.from('deals').select('*');
        
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
        
        setDeals(data || []);
      } catch (err) {
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
        
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setDeal(data);
      } catch (err) {
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
