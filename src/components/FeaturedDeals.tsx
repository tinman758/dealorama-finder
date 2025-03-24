
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DealCard from './DealCard';
import { Link } from 'react-router-dom';
import { useDeals } from '@/hooks/useDeals';
import { Loader2 } from 'lucide-react';

const FeaturedDeals = () => {
  const { deals: allFeaturedDeals, loading } = useDeals({ featured: true, limit: 12 });

  // Filter deals by type
  const codeDeals = React.useMemo(() => {
    return allFeaturedDeals.filter(deal => deal.type === 'code');
  }, [allFeaturedDeals]);
  
  const linkDeals = React.useMemo(() => {
    return allFeaturedDeals.filter(deal => deal.type === 'link');
  }, [allFeaturedDeals]);

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Deals</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Deals</TabsTrigger>
              <TabsTrigger value="codes">Coupon Codes</TabsTrigger>
              <TabsTrigger value="links">Deal Links</TabsTrigger>
            </TabsList>
            
            <Link to="/deals" className="text-sm font-medium text-deal hover:underline">
              View All Deals &rarr;
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allFeaturedDeals.slice(0, 8).map(deal => (
                    <DealCard key={deal.id} deal={deal} featured={true} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="codes" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {codeDeals.slice(0, 8).map(deal => (
                    <DealCard key={deal.id} deal={deal} featured={true} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="links" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {linkDeals.slice(0, 8).map(deal => (
                    <DealCard key={deal.id} deal={deal} featured={true} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedDeals;
