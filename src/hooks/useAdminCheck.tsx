
import { useState, useEffect } from 'react';
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
        // In a static app, we just check the isAdmin property directly
        setIsAdmin(user.isAdmin || false);
        setAdminRole(user.isAdmin ? 'admin' : null);
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
