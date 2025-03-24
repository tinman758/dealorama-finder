
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUpDown, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
  bg_color?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const initialFormState: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: '',
  cta_text: 'Shop Now',
  cta_link: '',
  bg_color: 'bg-gradient-to-r from-blue-600 to-teal-500',
  image_url: '',
  is_active: true,
  display_order: 0
};

const AdminAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setAdvertisements(data || []);
    } catch (error: any) {
      console.error('Error fetching advertisements:', error);
      toast.error(error.message || 'Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.cta_text || !formData.cta_link) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing advertisement
        const { error } = await supabase
          .from('advertisements')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Advertisement updated successfully');
      } else {
        // Insert new advertisement
        const { error } = await supabase
          .from('advertisements')
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Advertisement created successfully');
      }

      resetForm();
      fetchAdvertisements();
    } catch (error: any) {
      console.error('Error saving advertisement:', error);
      toast.error(error.message || 'Failed to save advertisement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setFormData({
      title: ad.title,
      description: ad.description,
      cta_text: ad.cta_text,
      cta_link: ad.cta_link,
      bg_color: ad.bg_color || 'bg-gradient-to-r from-blue-600 to-teal-500',
      image_url: ad.image_url || '',
      is_active: ad.is_active,
      display_order: ad.display_order
    });
    setEditingId(ad.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('advertisements')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Advertisement deleted successfully');
        fetchAdvertisements();
      } catch (error: any) {
        console.error('Error deleting advertisement:', error);
        toast.error(error.message || 'Failed to delete advertisement');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (ad: Advertisement) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !ad.is_active, updated_at: new Date().toISOString() })
        .eq('id', ad.id);

      if (error) throw error;
      toast.success(`Advertisement ${ad.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchAdvertisements();
    } catch (error: any) {
      console.error('Error toggling advertisement status:', error);
      toast.error(error.message || 'Failed to update advertisement status');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOrder = async (ad: Advertisement, direction: 'up' | 'down') => {
    // Find the adjacent ad based on current display order
    const sortedAds = [...advertisements].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedAds.findIndex(a => a.id === ad.id);
    
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedAds.length - 1)) {
      return; // Can't move further in this direction
    }
    
    const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const adjacentAd = sortedAds[adjacentIndex];
    
    setLoading(true);
    try {
      // Swap display orders
      const currentOrder = ad.display_order;
      const adjacentOrder = adjacentAd.display_order;
      
      // Update the current ad
      await supabase
        .from('advertisements')
        .update({ display_order: adjacentOrder, updated_at: new Date().toISOString() })
        .eq('id', ad.id);
        
      // Update the adjacent ad
      await supabase
        .from('advertisements')
        .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
        .eq('id', adjacentAd.id);
      
      toast.success('Advertisement order updated');
      fetchAdvertisements();
    } catch (error: any) {
      console.error('Error changing advertisement order:', error);
      toast.error(error.message || 'Failed to update advertisement order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Advertisement Management</h2>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? "Cancel" : <><Plus className="mr-1" size={16} /> New Advertisement</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
          <h3 className="text-lg font-medium mb-4">{editingId ? 'Edit Advertisement' : 'Create New Advertisement'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Advertisement Title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cta_text">Call to Action Text *</Label>
                <Input
                  id="cta_text"
                  name="cta_text"
                  value={formData.cta_text}
                  onChange={handleInputChange}
                  placeholder="E.g., Shop Now, Learn More"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Advertisement Description"
                  required
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="cta_link">Call to Action Link *</Label>
                <Input
                  id="cta_link"
                  name="cta_link"
                  value={formData.cta_link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/page"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bg_color">Background Color</Label>
                <Input
                  id="bg_color"
                  name="bg_color"
                  value={formData.bg_color || ''}
                  onChange={handleInputChange}
                  placeholder="bg-gradient-to-r from-blue-600 to-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Tailwind CSS classes or custom colors
                </p>
              </div>
              
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, display_order: value }));
                  }}
                  min={0}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.is_active} 
                  onCheckedChange={handleSwitchChange} 
                  id="is_active" 
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? 'Update' : 'Create'} Advertisement
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !advertisements.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : advertisements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  No advertisements found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              advertisements.map(ad => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col items-center">
                      <span>{ad.display_order}</span>
                      <div className="flex gap-1 mt-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleChangeOrder(ad, 'up')}
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ad.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {ad.cta_text} → {ad.cta_link}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[300px]">{ad.description}</div>
                    {ad.image_url && (
                      <div className="text-xs text-blue-500 truncate">
                        Has image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleActive(ad)}
                        title={ad.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {ad.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(ad)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAdvertisements;
