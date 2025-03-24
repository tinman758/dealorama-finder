
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  const { isAdmin, isAdminLoading } = useAdminCheck();

  if (isLoading || isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" asChild>
              <Link to="/admin">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="users" asChild>
              <Link to="/admin/users">Users</Link>
            </TabsTrigger>
            <TabsTrigger value="deals" asChild>
              <Link to="/admin/deals">Deals</Link>
            </TabsTrigger>
            <TabsTrigger value="stores" asChild>
              <Link to="/admin/stores">Stores</Link>
            </TabsTrigger>
            <TabsTrigger value="categories" asChild>
              <Link to="/admin/categories">Categories</Link>
            </TabsTrigger>
            <TabsTrigger value="advertisements" asChild>
              <Link to="/admin/advertisements">Advertisements</Link>
            </TabsTrigger>
            <TabsTrigger value="admins" asChild>
              <Link to="/admin/admins">Admin Users</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
