
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Store } from '@/types/index';
import { useStores } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';

const AdminStores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { stores, loading, error } = useStores();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    logo: '',
    category: '',
    url: '',
    description: '',
    storeType: 'online',
    featured: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      category: '',
      url: '',
      description: '',
      storeType: 'online',
      featured: false
    });
    setEditingStore(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditStore = async () => {
    if (!formData.name || !formData.logo || !formData.category || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const storeData = {
        name: formData.name,
        logo: formData.logo,
        category: formData.category,
        url: formData.url,
        description: formData.description || '',
        store_type: formData.storeType,
        featured: formData.featured,
        updated_at: new Date().toISOString()
      };

      if (editingStore) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', editingStore.id);

        if (error) throw error;
        toast.success('Store updated successfully');
      } else {
        // Add new store
        const { error } = await supabase
          .from('stores')
          .insert([{ ...storeData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success('Store added successfully');
      }

      // Reset form and close dialog
      resetForm();
      setShowAddDialog(false);
    } catch (error: any) {
      console.error('Error saving store:', error);
      toast.error(error.message || 'Failed to save store');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store? This will also delete all associated deals.')) return;
    
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Store deleted successfully');
    } catch (error: any) {
      console.error('Error deleting store:', error);
      toast.error(error.message || 'Failed to delete store');
    }
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      logo: store.logo,
      category: store.category,
      url: store.url,
      description: store.description || '',
      storeType: store.storeType || 'online',
      featured: store.featured || false
    });
    setShowAddDialog(true);
  };

  const toggleStoreFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ featured: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Store ${!currentValue ? 'featured' : 'unfeatured'} successfully`);
    } catch (error: any) {
      console.error('Error updating store:', error);
      toast.error(error.message || 'Failed to update store');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="p-4 text-red-500">Error loading stores: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stores Management</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search stores..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Store
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
                <DialogDescription>
                  {editingStore ? 'Update the details of the existing store.' : 'Create a new store to display on the site.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Store name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL *</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Store URL *</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeType">Store Type *</Label>
                  <Select
                    value={formData.storeType}
                    onValueChange={(value) => handleSelectChange('storeType', value as 'online' | 'local' | 'both')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 self-end">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="featured">Featured Store</Label>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Store description"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setShowAddDialog(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrEditStore} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStore ? 'Update Store' : 'Add Store'}
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {store.logo && (
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="h-8 w-8 mr-2 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium">{store.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{store.category}</TableCell>
                    <TableCell>
                      <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {store.url}
                      </a>
                    </TableCell>
                    <TableCell>{store.storeType || 'online'}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={store.featured} 
                        onCheckedChange={() => toggleStoreFeatured(store.id, store.featured!)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEditStore(store)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No stores found
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

export default AdminStores;
