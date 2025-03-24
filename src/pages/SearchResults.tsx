
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearchDeals, useSearchStores } from "@/hooks/useSearch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 12;

  // Use the search hooks
  const { deals, loading: dealsLoading } = useSearchDeals(query);
  const { stores, loading: storesLoading } = useSearchStores(query);

  useEffect(() => {
    // Reset to first page on new search
    setCurrentPage(1);
  }, [query]);

  // Calculate pagination
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = deals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(deals.length / dealsPerPage);

  // Handle page changes
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const loading = dealsLoading || storesLoading;

  if (!query) {
    return (
      <>
        <Navbar />
        <div className="container-fluid py-16 min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No Search Query Provided</h1>
            <p className="text-gray-600 mb-8">
              Please enter a search term to find deals and coupons.
            </p>
            <Link to="/" className="deal-button inline-flex items-center">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            <p className="text-gray-600">
              {deals.length} deals found for your search
            </p>
          )}
        </div>

        {/* Stores matching the search query */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {stores.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Matching Stores</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stores.map((store) => (
                    <Link
                      key={store.id}
                      to={`/store/${store.id}`}
                      className="flex flex-col items-center p-3 border border-gray-100 rounded-lg bg-white hover:shadow-glossy transition-shadow"
                    >
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="h-12 w-12 object-contain mb-2"
                      />
                      <span className="text-center text-sm font-medium">
                        {store.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {store.dealCount} deals
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Deal results */}
            {deals.length > 0 ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4">Deals & Coupons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => paginate(currentPage - 1)}
                          />
                        </PaginationItem>
                      )}

                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => paginate(currentPage + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="py-16 text-center bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">No deals found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any deals matching "{query}"
                </p>
                <Link to="/" className="deal-button inline-flex items-center">
                  Browse All Deals
                </Link>
              </div>
            )}

            {/* Recommendations */}
            {deals.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-semibold mb-4">
                  You might also like these deals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {deals
                    .filter((deal) => deal.featured)
                    .slice(0, 4)
                    .map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
