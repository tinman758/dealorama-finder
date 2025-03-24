
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Plus, Edit, Trash, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Deal } from '@/types/index';
import { useDeals } from '@/hooks/useDeals';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStores } from '@/hooks/useStores';
import { useCategories } from '@/hooks/useCategories';
import { DatePicker } from '@/components/ui/date-picker';

const AdminDeals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { deals, loading, error } = useDeals();
  const { stores } = useStores();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: '',
    description: '',
    discount: '',
    storeId: '',
    url: '',
    category: '',
    type: 'code',
    code: '',
    verified: false,
    featured: false,
    expiryDate: undefined
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      storeId: '',
      url: '',
      category: '',
      type: 'code',
      code: '',
      verified: false,
      featured: false,
      expiryDate: undefined
    });
    setEditingDeal(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      expiryDate: date ? date.toISOString() : undefined 
    }));
  };

  const handleAddOrEditDeal = async () => {
    if (!formData.title || !formData.discount || !formData.storeId || !formData.url || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const dealData = {
        title: formData.title,
        description: formData.description || '',
        discount: formData.discount,
        store_id: formData.storeId,
        url: formData.url,
        category: formData.category,
        type: formData.type,
        code: formData.code,
        verified: formData.verified,
        featured: formData.featured,
        expiry_date: formData.expiryDate,
        updated_at: new Date().toISOString()
      };

      if (editingDeal) {
        // Update existing deal
        const { error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', editingDeal.id);

        if (error) throw error;
        toast.success('Deal updated successfully');
      } else {
        // Add new deal
        const { error } = await supabase
          .from('deals')
          .insert([{ ...dealData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success('Deal added successfully');
      }

      // Reset form and close dialog
      resetForm();
      setShowAddDialog(false);
    } catch (error: any) {
      console.error('Error saving deal:', error);
      toast.error(error.message || 'Failed to save deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Deal deleted successfully');
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      toast.error(error.message || 'Failed to delete deal');
    }
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description,
      discount: deal.discount,
      storeId: deal.storeId,
      url: deal.url,
      category: deal.category,
      type: deal.type || 'code',
      code: deal.code,
      verified: deal.verified,
      featured: deal.featured,
      expiryDate: deal.expiryDate
    });
    setShowAddDialog(true);
  };

  const toggleDealFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ featured: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Deal ${!currentValue ? 'featured' : 'unfeatured'} successfully`);
    } catch (error: any) {
      console.error('Error updating deal:', error);
      toast.error(error.message || 'Failed to update deal');
    }
  };

  const toggleDealVerified = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ verified: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Deal ${!currentValue ? 'verified' : 'unverified'} successfully`);
    } catch (error: any) {
      console.error('Error updating deal:', error);
      toast.error(error.message || 'Failed to update deal');
    }
  };

  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.discount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="p-4 text-red-500">Error loading deals: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Deals Management</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search deals..."
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
                Add New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
                <DialogDescription>
                  {editingDeal ? 'Update the details of the existing deal.' : 'Create a new deal to display on the site.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Deal title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount/Offer *</Label>
                  <Input
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g. 20% OFF, Buy 1 Get 1 Free"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deal description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeId">Store *</Label>
                  <Select
                    value={formData.storeId}
                    onValueChange={(value) => handleSelectChange('storeId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="type">Deal Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value as 'code' | 'link' | 'product')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="code">Coupon Code</SelectItem>
                      <SelectItem value="link">Deal Link</SelectItem>
                      <SelectItem value="product">Product Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <DatePicker 
                    date={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                    setDate={handleDateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code (if applicable)</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. SAVE20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Deal URL *</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/deal"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => handleSwitchChange('verified', checked)}
                  />
                  <Label htmlFor="verified">Verified Deal</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Deal</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setShowAddDialog(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrEditDeal} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDeal ? 'Update Deal' : 'Add Deal'}
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
                <TableHead>Title</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.discount}</TableCell>
                    <TableCell>{deal.category}</TableCell>
                    <TableCell>
                      {deal.expiryDate 
                        ? new Date(deal.expiryDate).toLocaleDateString() 
                        : 'No expiry'}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={deal.featured} 
                        onCheckedChange={() => toggleDealFeatured(deal.id, deal.featured!)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={deal.verified} 
                        onCheckedChange={() => toggleDealVerified(deal.id, deal.verified)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEditDeal(deal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteDeal(deal.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No deals found
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

export default AdminDeals;
