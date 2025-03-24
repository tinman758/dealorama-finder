
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { Button } from '@/components/ui/button';
import { Filter, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeals } from '@/hooks/useDeals';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const DealsPage = () => {
  const [showFeatured, setShowFeatured] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dealTypeFilter, setDealTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  
  const { categories } = useCategories();
  const { deals, loading } = useDeals({
    featured: showFeatured || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    type: dealTypeFilter !== "all" ? dealTypeFilter as any : undefined,
    search: searchQuery || undefined
  });
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">All Deals</h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto md:min-w-[300px] lg:min-w-[400px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search deals..." 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
            
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
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
            Showing {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No deals match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setShowFeatured(false);
                  setCategoryFilter("all");
                  setDealTypeFilter("all");
                  setSearchQuery("");
                  setSearchValue("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map(deal => (
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
