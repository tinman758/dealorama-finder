
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Deal } from '@/types/index';

const AdminDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      
      // For now, using mock data since the deals table doesn't exist in Supabase yet
      const mockDeals: Deal[] = [
        {
          id: '1',
          title: '50% Off Electronics',
          description: 'Get 50% off on all electronics',
          discount: '50%',
          storeId: '1',
          verified: true,
          featured: true,
          url: 'https://example.com/deal1',
          category: 'Electronics',
          expiryDate: new Date(2025, 5, 15).toISOString(),
        },
        {
          id: '2',
          title: 'Buy One Get One Free',
          description: 'Buy one item and get another for free',
          discount: 'BOGO',
          storeId: '2',
          verified: false,
          featured: false,
          url: 'https://example.com/deal2',
          category: 'Fashion',
        },
      ];
      
      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const toggleDealFeatured = async (id: string, currentValue: boolean) => {
    try {
      // This would update the database in a real implementation
      setDeals(deals.map(deal => 
        deal.id === id ? { ...deal, featured: !currentValue } : deal
      ));
      
      toast.success(`Deal ${!currentValue ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
    }
  };

  const toggleDealVerified = async (id: string, currentValue: boolean) => {
    try {
      // This would update the database in a real implementation
      setDeals(deals.map(deal => 
        deal.id === id ? { ...deal, verified: !currentValue } : deal
      ));
      
      toast.success(`Deal ${!currentValue ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
    }
  };

  const deleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      // This would delete from the database in a real implementation
      setDeals(deals.filter(deal => deal.id !== id));
      toast.success('Deal deleted successfully');
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.discount.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Deal
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
                <TableHead>Title</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.discount}</TableCell>
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
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => deleteDeal(deal.id)}
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
