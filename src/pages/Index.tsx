
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDeals from '@/components/FeaturedDeals';
import PopularCategories from '@/components/PopularCategories';
import AdvertisementBanner from '@/components/AdvertisementBanner';
import PopularStores from '@/components/PopularStores';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedDeals />
        
        {/* Advertisement Banner */}
        <section className="py-6">
          <div className="container-fluid">
            <AdvertisementBanner
              title="Exclusive Summer Deals!"
              description="Get up to 50% off on selected items. Limited time offer. Don't miss out!"
              ctaText="Shop Now"
              ctaLink="#"
              bgColor="bg-gradient-to-r from-blue-600 to-teal-500"
              imageUrl="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            />
          </div>
        </section>
        
        <PopularCategories />
        <PopularStores />
        
        {/* Second Advertisement Banner */}
        <section className="py-12">
          <div className="container-fluid">
            <AdvertisementBanner
              title="Join Our Premium Membership"
              description="Get exclusive access to premium deals, early notifications, and special discounts only available to members."
              ctaText="Sign Up Today"
              ctaLink="#"
              bgColor="bg-gradient-to-r from-purple-600 to-pink-500"
            />
          </div>
        </section>
        
        {/* FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
