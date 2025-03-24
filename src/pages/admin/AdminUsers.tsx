
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Search, ShieldCheck, ShieldX, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState('editor');
  const [adminUsers, setAdminUsers] = useState<{id: string, user_id: string, role: string}[]>([]);
  const { user: currentUser, makeAdmin, removeAdmin } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (userError) throw userError;
      
      // Get admin data
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*');
        
      if (adminError) throw adminError;
      
      setUsers(userData || []);
      setAdminUsers(adminData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleMakeAdmin = async () => {
    if (!selectedUserId) return;
    
    const success = await makeAdmin(selectedUserId, adminRole);
    
    if (success) {
      fetchUsers();
      setShowAddDialog(false);
      setSelectedUserId(null);
      setAdminRole('editor');
    }
  };

  const handleRemoveAdmin = async (adminId: string, userId: string) => {
    if (!window.confirm('Are you sure you want to remove admin privileges from this user?')) return;
    
    const success = await removeAdmin(adminId);
    
    if (success) {
      fetchUsers();
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getAdminInfo = (userId: string) => {
    return adminUsers.find(admin => admin.user_id === userId);
  };

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
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Admin User</DialogTitle>
                <DialogDescription>
                  Grant admin privileges to an existing user.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Select User</Label>
                  <Select 
                    value={selectedUserId || ''} 
                    onValueChange={setSelectedUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter(user => !user.is_admin)
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || user.email}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Admin Role</Label>
                  <Select 
                    value={adminRole} 
                    onValueChange={setAdminRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="super">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMakeAdmin} disabled={!selectedUserId}>
                  Add Admin
                </Button>
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
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Admin Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const adminInfo = getAdminInfo(user.id);
                  const isCurrentUser = currentUser?.id === user.id;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{user.name || 'No Name'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString() 
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <div className="flex items-center">
                            <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              {adminInfo?.role || 'Admin'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Regular User</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.is_admin && adminInfo ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveAdmin(adminInfo.id, user.id)}
                            disabled={isCurrentUser} // Prevent removing admin from themselves
                          >
                            <ShieldX className="w-4 h-4 mr-1" />
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setAdminRole('editor');
                              setShowAddDialog(true);
                            }}
                          >
                            <ShieldCheck className="w-4 h-4 mr-1" />
                            Make Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
