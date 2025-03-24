
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, TagIcon, ShoppingBagIcon, BellIcon } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: SearchIcon,
      title: "Search for Deals",
      description: "Use our powerful search engine to find deals across hundreds of stores and brands. Filter by category, store, or price range to narrow down your options."
    },
    {
      icon: TagIcon,
      title: "Browse Categories",
      description: "Explore deals by categories such as Electronics, Fashion, Home, and more. Find trending deals in your favorite shopping categories."
    },
    {
      icon: ShoppingBagIcon,
      title: "Shop and Save",
      description: "Click through to the retailer's website and make your purchase. Your discount will be automatically applied at checkout or you'll be provided with a coupon code."
    },
    {
      icon: BellIcon,
      title: "Get Notifications",
      description: "Sign up for alerts to be notified when new deals are available for your favorite stores or categories. Never miss a great deal again!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-fluid py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">How DealFinder Works</h1>
            <Separator className="mb-8" />
            
            <p className="text-lg text-gray-700 mb-10">
              Finding and using deals with DealFinder is simple and straightforward. Follow these steps to start saving money on your purchases.
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              {steps.map((step, index) => (
                <Card key={index} className="border-2 border-gray-100 hover:border-deal/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-deal-light p-3 w-fit mb-4">
                      <step.icon className="h-6 w-6 text-deal" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Are the deals on DealFinder really free?</h3>
                  <p className="text-gray-600">Yes, all deals on DealFinder are completely free to access. We don't charge you anything to use our service.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">How often are new deals added?</h3>
                  <p className="text-gray-600">We add new deals daily. Our team constantly searches for the best offers and updates the site throughout the day.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">How do I know if a deal is still valid?</h3>
                  <p className="text-gray-600">We verify deals regularly and show expiration dates when available. However, deals can sell out or end early. We recommend acting quickly on deals you're interested in.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Do I need to create an account to use DealFinder?</h3>
                  <p className="text-gray-600">No, you can browse and use most deals without creating an account. However, creating a free account allows you to save favorite deals, set up alerts, and personalize your experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
