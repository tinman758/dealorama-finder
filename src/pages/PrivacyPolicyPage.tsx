
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage = () => {
  const lastUpdated = "October 15, 2023";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-fluid py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-500 mb-6">Last Updated: {lastUpdated}</p>
            <Separator className="mb-8" />
            
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
                <p>
                  At DealFinder, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Information We Collect</h2>
                <h3 className="text-xl font-medium mb-2">Personal Data</h3>
                <p className="mb-4">
                  We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, and phone number.
                </p>
                <h3 className="text-xl font-medium mb-2">Non-Personal Data</h3>
                <p>
                  We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. How We Use Your Information</h2>
                <p className="mb-4">We may use the information we collect from you for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>To personalize your experience and deliver content and product offerings relevant to your interests.</li>
                  <li>To improve our website and provide better service.</li>
                  <li>To process transactions and send related information including confirmations and receipts.</li>
                  <li>To send periodic emails regarding deals, products, services, or other information.</li>
                  <li>To follow up with them after correspondence (email or phone inquiries).</li>
                </ul>
                <p>
                  We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Cookies and Tracking Technologies</h2>
                <p>
                  Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Third-Party Websites</h2>
                <p>
                  Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Security</h2>
                <p>
                  We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Your Rights</h2>
                <p>
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Changes to This Privacy Policy</h2>
                <p>
                  We have the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at privacy@dealfinder.com.
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

export default PrivacyPolicyPage;
