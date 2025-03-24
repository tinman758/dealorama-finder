
import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Use explicit table reference with fully qualified column names to avoid ambiguous references
        const { data, error } = await supabase
          .from('categories')
          .select(`
            categories.id, 
            categories.name, 
            categories.slug, 
            categories.icon, 
            categories.created_at, 
            categories.updated_at
          `)
          .order('name');
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        // Use explicit table reference with fully qualified column names to avoid ambiguous references
        const { data, error } = await supabase
          .from('categories')
          .select(`
            categories.id, 
            categories.name, 
            categories.slug, 
            categories.icon, 
            categories.created_at, 
            categories.updated_at
          `)
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  return { category, loading, error };
}
