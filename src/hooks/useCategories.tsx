
import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, icon')
        .order('name');
      
      if (error) throw error;
      
      // Map to ensure we're properly formatting our category objects
      const formattedCategories: Category[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        icon: item.icon || undefined
      }));
      
      setCategories(formattedCategories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Expose refetchCategories function to manually trigger a refresh
  const refetchCategories = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetchCategories };
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, icon')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        // Format the category correctly
        if (data) {
          const formattedCategory: Category = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            icon: data.icon || undefined
          };
          setCategory(formattedCategory);
        }
      } catch (err: any) {
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
