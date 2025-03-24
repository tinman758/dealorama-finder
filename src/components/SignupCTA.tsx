
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const SignupCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container-fluid">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Join DealFinder today and never miss a deal!
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Sign up for free and get access to exclusive deals, personalized recommendations, 
                and notifications for your favorite stores and products.
              </p>
              
              <ul className="mt-8 space-y-3">
                {[
                  'Get personalized deal recommendations',
                  'Save your favorite deals and stores',
                  'Receive alerts when new deals are added',
                  'Create deal collections',
                  'Submit and share deals with the community'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-deal shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button className="bg-deal hover:bg-deal-hover text-white px-8 py-2 h-auto" size="lg" asChild>
                  <Link to="/signup">Sign Up for Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-auto" asChild>
                  <Link to="/login">Already have an account? Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-lg bg-white shadow-xl p-6 md:p-8 relative z-10 rotate-3">
                <div className="space-y-4">
                  <div className="w-full h-36 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="w-24 h-8 bg-deal rounded-md"></div>
                    <div className="w-16 h-8 bg-gray-100 rounded-md"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-indigo-100 rounded-lg -rotate-6 z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupCTA;
