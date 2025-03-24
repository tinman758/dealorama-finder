
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const AdminNavLink = () => {
  const { isAdmin, isAdminLoading } = useAdminCheck();

  if (isAdminLoading || !isAdmin) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
    >
      Admin Dashboard
    </Link>
  );
};

export default AdminNavLink;
