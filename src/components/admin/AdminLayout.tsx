
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  const { isAdmin, isAdminLoading } = useAdminCheck();
  const navigate = useNavigate();

  // This useEffect ensures we redirect when we have the data
  useEffect(() => {
    if (!isLoading && !isAdminLoading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, isAdminLoading, navigate]);

  if (isLoading || isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Don't redirect here, let the useEffect handle it to avoid race conditions
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking permissions...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
      <Footer />
    </>
  );
};

export default AdminLayout;
