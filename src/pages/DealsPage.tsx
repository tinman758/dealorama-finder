
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { deals } from '@/data/deals';
import { Button } from '@/components/ui/button';
import { Filter, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DealsPage = () => {
  const [filteredDeals, setFilteredDeals] = useState(deals);
  const [showFeatured, setShowFeatured] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dealTypeFilter, setDealTypeFilter] = useState("all");
  
  // Get unique categories from deals data
  const uniqueCategories = Array.from(new Set(deals.map(deal => deal.category)));
  
  // Handle filters
  const applyFilters = () => {
    let filtered = [...deals];
    
    // Apply featured filter
    if (showFeatured) {
      filtered = filtered.filter(deal => deal.featured);
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(deal => deal.category === categoryFilter);
    }
    
    // Apply deal type filter
    if (dealTypeFilter !== "all") {
      filtered = filtered.filter(deal => deal.type === dealTypeFilter);
    }
    
    setFilteredDeals(filtered);
  };
  
  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [showFeatured, categoryFilter, dealTypeFilter]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">All Deals</h1>
            
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Deal Type Filter */}
              <Select value={dealTypeFilter} onValueChange={setDealTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Deal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="code">Promo Code</SelectItem>
                  <SelectItem value="link">Deal Link</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Featured Toggle */}
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${showFeatured ? 'bg-amber-50 border-amber-200' : ''}`}
                onClick={() => setShowFeatured(!showFeatured)}
              >
                <Star className={`h-4 w-4 ${showFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                Featured Only
              </Button>
            </div>
          </div>
          
          {/* Display filtered deals count */}
          <p className="text-gray-600 mb-6">
            Showing {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'}
          </p>
          
          {filteredDeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No deals match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setShowFeatured(false);
                  setCategoryFilter("all");
                  setDealTypeFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DealsPage;
