
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDeals from '@/components/FeaturedDeals';
import PopularCategories from '@/components/PopularCategories';
import PopularStores from '@/components/PopularStores';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AdsCarousel from '@/components/AdsCarousel';
import SignupCTA from '@/components/SignupCTA';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedDeals />
        
        {/* Advertisement Carousel - now fetching from database */}
        <section className="py-6">
          <div className="container-fluid">
            <AdsCarousel />
          </div>
        </section>
        
        <PopularCategories />
        <PopularStores />
        
        {/* Signup CTA Section */}
        <SignupCTA />
        
        {/* FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
