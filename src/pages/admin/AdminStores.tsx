
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Store } from '@/types/index';

const AdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      // For now, using mock data since the stores table doesn't exist in Supabase yet
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Amazon',
          logo: 'https://example.com/amazon.png',
          category: 'E-commerce',
          featured: true,
          dealCount: 25,
          url: 'https://amazon.com',
        },
        {
          id: '2',
          name: 'Best Buy',
          logo: 'https://example.com/bestbuy.png',
          category: 'Electronics',
          featured: false,
          dealCount: 15,
          url: 'https://bestbuy.com',
        },
      ];
      
      setStores(mockStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreFeatured = async (id: string, currentValue: boolean) => {
    try {
      // This would update the database in a real implementation
      setStores(stores.map(store => 
        store.id === id ? { ...store, featured: !currentValue } : store
      ));
      
      toast.success(`Store ${!currentValue ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store');
    }
  };

  const deleteStore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store? This will also delete all associated deals.')) return;
    
    try {
      // This would delete from the database in a real implementation
      setStores(stores.filter(store => store.id !== id));
      toast.success('Store deleted successfully');
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Store
          </Button>
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
                <TableHead>Deals</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell>{store.dealCount}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={store.featured} 
                        onCheckedChange={() => toggleStoreFeatured(store.id, store.featured!)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => deleteStore(store.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
