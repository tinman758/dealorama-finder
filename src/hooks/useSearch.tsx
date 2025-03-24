
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Deal, Store } from '@/types';

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
        
        const { data, error } = await supabase
          .from('deals')
          .select('id, title, description, code, discount, expiry_date, store_id, verified, featured, url, image, category, used_count, type, price, original_price, product_image')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order('created_at', { ascending: false });
        
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
        
        setDeals(mappedDeals);
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
        
        const { data, error } = await supabase
          .from('stores')
          .select('id, name, logo, category, featured, deal_count, url, store_type, country, description')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .order('name');
        
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
