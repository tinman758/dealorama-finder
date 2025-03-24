
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
        
        setDeals(mappedDeals);
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
        }
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
