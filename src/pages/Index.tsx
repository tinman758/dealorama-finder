
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDeals from '@/components/FeaturedDeals';
import PopularCategories from '@/components/PopularCategories';
import PopularStores from '@/components/PopularStores';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AdsCarousel from '@/components/AdsCarousel';
import SignupCTA from '@/components/SignupCTA';

// Ad data for the carousel
const advertisements = [
  {
    id: 'ad1',
    title: 'Exclusive Summer Deals!',
    description: 'Get up to 50% off on selected items. Limited time offer. Don\'t miss out!',
    ctaText: 'Shop Now',
    ctaLink: 'https://example.com/summer-deals',
    bgColor: 'bg-gradient-to-r from-blue-600 to-teal-500',
    imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
  },
  {
    id: 'ad2',
    title: 'Back to School Savings',
    description: 'Prepare for the new school year with our special discounts on electronics and supplies!',
    ctaText: 'View Offers',
    ctaLink: 'https://example.com/school-deals',
    bgColor: 'bg-gradient-to-r from-amber-500 to-pink-500',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2022&q=80'
  },
  {
    id: 'ad3',
    title: 'Flash Sale: 24 Hours Only!',
    description: 'Incredible deals across all categories. The clock is ticking!',
    ctaText: 'Shop Flash Sale',
    ctaLink: 'https://example.com/flash-sale',
    bgColor: 'bg-gradient-to-r from-red-600 to-orange-400',
    imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2215&q=80'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedDeals />
        
        {/* Advertisement Carousel */}
        <section className="py-6">
          <div className="container-fluid">
            <AdsCarousel ads={advertisements} />
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
