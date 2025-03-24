
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

const AdminAdmins = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('editor');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newAdminId) {
      toast.error('Please enter a user ID');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: newAdminId,
          role: newAdminRole
        });

      if (error) throw error;
      toast.success('Admin user added successfully');
      setIsDialogOpen(false);
      setNewAdminId('');
      fetchAdminUsers();
    } catch (error: any) {
      console.error('Error adding admin user:', error);
      toast.error(error.message || 'Failed to add admin user');
    }
  };

  const removeAdminUser = async (id: string, userId: string) => {
    // Don't allow removing yourself
    if (user?.id === userId) {
      toast.error("You cannot remove yourself from admin");
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Admin user removed');
      fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast.error('Failed to remove admin user');
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Users Management</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search admins..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <div>
                  <label className="block text-sm font-medium mb-1">User ID</label>
                  <Input 
                    placeholder="User ID" 
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the UUID of the user</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                
                <Button onClick={addAdminUser}>Add Admin User</Button>
              </div>
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
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-mono text-xs">{admin.user_id}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${
                      admin.role === 'super_admin' 
                        ? 'bg-red-100 text-red-800' 
                        : admin.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeAdminUser(admin.id, admin.user_id)}
                      disabled={user?.id === admin.user_id}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No admin users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminAdmins;
