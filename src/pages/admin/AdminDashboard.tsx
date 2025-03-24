
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
        // Count users
        const { count: usersCount } = await supabase
          .from('auth.users')
          .select('*', { count: 'exact', head: true });

        // Count deals
        const { count: dealsCount } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true });

        // Count stores
        const { count: storesCount } = await supabase
          .from('stores')
          .select('*', { count: 'exact', head: true });

        // Count categories
        const { count: categoriesCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        setCounts({
          users: usersCount || 0,
          deals: dealsCount || 0,
          stores: storesCount || 0,
          categories: categoriesCount || 0,
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
