
import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { categories as staticCategories } from '@/data/staticData';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCategories(staticCategories);
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const foundCategory = staticCategories.find(cat => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError('Category not found');
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
