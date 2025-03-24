
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleEllipsis, ShoppingBag, Store, Tag, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    deals: 0,
    stores: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        // Get user count
        const { count: userCount, error: userError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
          
        if (userError) {
          console.error('Error fetching user count:', userError);
        }

        // Get deals count - use explicit count query
        const { count: dealCount, error: dealError } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true });
          
        if (dealError) {
          console.error('Error fetching deal count:', dealError);
        }

        // Get stores count - use explicit count query
        const { count: storeCount, error: storeError } = await supabase
          .from('stores')
          .select('*', { count: 'exact', head: true });
          
        if (storeError) {
          console.error('Error fetching store count:', storeError);
        }

        // Get categories count - use explicit count query
        const { count: categoryCount, error: categoryError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });
          
        if (categoryError) {
          console.error('Error fetching category count:', categoryError);
        }

        setCounts({
          users: userCount || 0,
          deals: dealCount || 0,
          stores: storeCount || 0,
          categories: categoryCount || 0,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <CircleEllipsis className="h-6 w-6 animate-spin" /> : counts.users}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <CircleEllipsis className="h-6 w-6 animate-spin" /> : counts.deals}
            </div>
            <p className="text-xs text-muted-foreground">Active deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <CircleEllipsis className="h-6 w-6 animate-spin" /> : counts.stores}
            </div>
            <p className="text-xs text-muted-foreground">Featured stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <CircleEllipsis className="h-6 w-6 animate-spin" /> : counts.categories}
            </div>
            <p className="text-xs text-muted-foreground">Deal categories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
