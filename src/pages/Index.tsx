
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDeals from '@/components/FeaturedDeals';
import PopularStores from '@/components/PopularStores';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedDeals />
        <PopularStores />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
