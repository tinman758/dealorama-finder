
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminNavLink = () => {
  const { isAdmin, isAdminLoading } = useAdminCheck();

  if (isAdminLoading || !isAdmin) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1 text-penny-blue border-penny-blue/30 hover:bg-penny-blue/10"
      asChild
    >
      <Link to="/admin">
        <LayoutDashboard className="h-4 w-4 mr-1" />
        Admin
      </Link>
    </Button>
  );
};

export default AdminNavLink;
