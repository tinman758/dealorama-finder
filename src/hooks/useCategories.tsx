
import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Sample category data
const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Fashion",
    slug: "fashion",
    icon: "shirt"
  },
  {
    id: "2",
    name: "Electronics",
    slug: "electronics",
    icon: "laptop"
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    icon: "home"
  },
  {
    id: "4",
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "heart"
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
        
        // Return the data from the database, or sample data if no categories were found
        setCategories(data && data.length > 0 ? data : sampleCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Return sample data if there was an error
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
        
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
        
        // Find the category in sample data if there was an error
        const sampleCategory = sampleCategories.find(c => c.slug === slug);
        if (sampleCategory) {
          setCategory(sampleCategory);
        }
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
