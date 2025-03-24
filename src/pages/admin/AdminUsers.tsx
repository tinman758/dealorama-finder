
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, UserPlus, UserCheck, UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  role?: string;
  admin_id?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminRole, setAdminRole] = useState('editor');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { makeAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First, get all admin users to identify which users are admins
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, user_id, role, created_at');
        
      if (adminError) throw adminError;

      // For a production app, we would create a secure backend API or Edge Function 
      // to fetch user information from auth.users
      // For this demo, we'll display the admin users we have and add some mock regular users
      
      const adminUsers: User[] = adminData.map((admin) => ({
        id: admin.user_id,
        email: `admin-${admin.user_id.substring(0, 6)}@example.com`,
        name: `Admin User ${admin.user_id.substring(0, 4)}`,
        created_at: admin.created_at,
        last_sign_in_at: new Date().toISOString(),
        is_admin: true,
        role: admin.role,
        admin_id: admin.id
      }));
      
      // Add some mock regular users for demonstration
      const regularUsers: User[] = [
        {
          id: 'reg-user-1',
          email: 'user1@example.com',
          name: 'Regular User 1',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          is_admin: false
        },
        {
          id: 'reg-user-2',
          email: 'user2@example.com',
          name: 'Regular User 2',
          created_at: new Date().toISOString(),
          last_sign_in_at: null,
          is_admin: false
        },
        {
          id: 'reg-user-3',
          email: 'user3@example.com',
          name: 'Regular User 3',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          is_admin: false
        }
      ];
      
      // Combine admin and regular users
      setUsers([...adminUsers, ...regularUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!adminIdInput.trim()) {
      toast.error('Please enter a user ID');
      return;
    }
    
    try {
      const success = await makeAdmin(adminIdInput, adminRole);
      if (success) {
        setDialogOpen(false);
        setAdminIdInput('');
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error('Error making user admin:', error);
      toast.error('Failed to assign admin privileges');
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const { removeAdmin } = useAuth();
      const success = await removeAdmin(adminId);
      if (success) {
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error('Error removing admin privileges:', error);
      toast.error('Failed to remove admin privileges');
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const filteredUsers = users.filter(user => 
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Admin User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p>Enter user ID to grant admin privileges:</p>
                <Input 
                  placeholder="User ID" 
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                />
                <p>Select role:</p>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleMakeAdmin}>Add as Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>User</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className={user.is_admin ? "border-2 border-primary" : ""}>
                      <AvatarFallback className={user.is_admin ? "bg-primary text-primary-foreground" : "bg-muted"}>
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.is_admin && <div className="text-xs mt-1 font-medium text-primary">{user.role || 'Admin'}</div>}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck className="inline-block w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString() 
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => user.admin_id && handleRemoveAdmin(user.admin_id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Remove Admin
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setAdminIdInput(user.id);
                          setDialogOpen(true);
                        }}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsers;
