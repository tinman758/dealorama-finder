
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
        // Use explicit column selection to avoid ambiguity
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error checking admin status from profile:', profileError);
          setIsAdmin(false);
          setAdminRole(null);
          setIsAdminLoading(false);
          return;
        }

        if (!profileData.is_admin) {
          setIsAdmin(false);
          setAdminRole(null);
          setIsAdminLoading(false);
          return;
        }

        // If they are an admin, get their role with explicit column selection
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (adminError) {
          console.error('Error getting admin role:', adminError);
          setIsAdmin(true); // We know they're an admin from user_profiles
          setAdminRole(null);
        } else {
          setIsAdmin(true);
          setAdminRole(adminData?.role || null);
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
