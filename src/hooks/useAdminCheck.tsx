
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminRole(null);
        setIsAdminLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setAdminRole(null);
        } else {
          setIsAdmin(true);
          setAdminRole(data?.role || null);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        toast.error('Failed to verify admin permissions');
        setIsAdmin(false);
        setAdminRole(null);
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isAdminLoading, adminRole };
};
