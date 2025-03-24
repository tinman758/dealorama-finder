
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const TermsOfServicePage = () => {
  const lastUpdated = "October 15, 2023";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-fluid py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-500 mb-6">Last Updated: {lastUpdated}</p>
            <Separator className="mb-8" />
            
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using DealFinder, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Description of Service</h2>
                <p>
                  DealFinder provides users with access to a collection of deals, discounts, and promotional offers from various online retailers and brands. The service includes a searchable database of offers, email notifications, and other related features. The service is provided "as is" and on an "as available" basis without warranties of any kind, either express or implied.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. User Conduct</h2>
                <p className="mb-4">You agree not to use DealFinder for any unlawful purpose or to engage in any prohibited conduct, including but not limited to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Using the service for any illegal purpose, or in violation of any local, state, national, or international law.</li>
                  <li>Harassing, threatening, or intimidating any other users of DealFinder.</li>
                  <li>Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
                  <li>Interfering with or disrupting the service or servers or networks connected to the service.</li>
                  <li>Attempting to gain unauthorized access to the service, other accounts, computer systems or networks connected to the service.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Intellectual Property</h2>
                <p>
                  The content, organization, graphics, design, compilation, and other matters related to DealFinder are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution, use, or publication by you of any such content or any part of the service is prohibited without express written permission from DealFinder.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Deals and Offers</h2>
                <p>
                  DealFinder makes every effort to provide accurate and up-to-date information about deals and offers. However, we cannot guarantee the accuracy, validity, or expiration dates of any deals listed on our service. Users should verify all information before making a purchase. DealFinder is not responsible for any issues that may arise from using the deals or offers listed on our service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Third-Party Links</h2>
                <p>
                  DealFinder may provide links to third-party websites or services for your convenience and information. We do not endorse, control, or guarantee the accuracy, relevance, timeliness, or completeness of information on these third-party websites. The inclusion of any links to third-party sites does not necessarily imply a recommendation or endorsement of the views expressed within them.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Limitation of Liability</h2>
                <p>
                  In no event shall DealFinder, its officers, directors, employees, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Modifications to Terms</h2>
                <p>
                  DealFinder reserves the right, at its sole discretion, to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes. Your continued use of the service following the posting of any changes to the Terms constitutes acceptance of those changes.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at terms@dealfinder.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
