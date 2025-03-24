
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { stores } from '@/data/stores';

const AllStores = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-fluid">
          <h1 className="text-3xl font-bold mb-8">All Stores</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="h-16 w-16 flex items-center justify-center mb-4">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="max-h-12 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{store.name}</h3>
                <p className="text-xs text-gray-600">{store.dealCount} deals available</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllStores;
