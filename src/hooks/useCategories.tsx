
import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample categories data
const sampleCategories: Category[] = [
  {
    id: 'sample-1',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'laptop'
  },
  {
    id: 'sample-2',
    name: 'Fashion',
    slug: 'fashion',
    icon: 'shirt'
  },
  {
    id: 'sample-3',
    name: 'Home & Garden',
    slug: 'home-garden',
    icon: 'home'
  },
  {
    id: 'sample-4',
    name: 'Travel',
    slug: 'travel',
    icon: 'plane'
  },
  {
    id: 'sample-5',
    name: 'Food & Dining',
    slug: 'food-dining',
    icon: 'utensils'
  }
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, icon, created_at, updated_at')
          .order('name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Use sample data if no data returned
          setCategories(sampleCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Fall back to sample data on error
        setCategories(sampleCategories);
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
        
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, icon, created_at, updated_at')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCategory(data);
        } else {
          // Find a sample category if no data returned
          const sampleCategory = sampleCategories.find(c => c.slug === slug) || sampleCategories[0];
          setCategory(sampleCategory);
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
        // Find a sample category as fallback
        const sampleCategory = sampleCategories.find(c => c.slug === slug) || sampleCategories[0];
        setCategory(sampleCategory);
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
