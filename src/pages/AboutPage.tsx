
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-fluid py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About DealFinder</h1>
            <Separator className="mb-8" />
            
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h2>
                <p className="mb-4">
                  At DealFinder, our mission is simple: to help you save money on every purchase. We believe that everyone 
                  deserves access to the best deals and discounts, without having to spend hours searching for them.
                </p>
                <p>
                  We aggregate thousands of deals from hundreds of popular stores and brands, making it easy for you to 
                  find exactly what you're looking for at the best possible price.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Story</h2>
                <p className="mb-4">
                  DealFinder was founded in 2023 by a group of shopping enthusiasts who were tired of missing out on great 
                  deals. We started as a small team passionate about finding and sharing the best discounts, and we've 
                  grown into a platform used by thousands of smart shoppers every day.
                </p>
                <p>
                  What started as a simple blog has evolved into a comprehensive deal-finding platform that leverages 
                  technology to bring you the most relevant and valuable deals in real-time.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Team</h2>
                <p className="mb-4">
                  Behind DealFinder is a dedicated team of deal hunters, developers, and customer service professionals 
                  who are committed to creating the best possible experience for our users.
                </p>
                <p>
                  We're united by our passion for helping people save money and our belief that finding great deals 
                  should be easy and enjoyable.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Values</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Transparency:</strong> We're open about how we find and present deals.</li>
                  <li><strong>Accuracy:</strong> We verify all deals to ensure they're valid and valuable.</li>
                  <li><strong>User Focus:</strong> We constantly improve based on user feedback.</li>
                  <li><strong>Inclusivity:</strong> We aim to make deal-finding accessible to everyone.</li>
                  <li><strong>Innovation:</strong> We continuously explore new ways to help you save.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
