
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Mail, MapPin, Phone } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-fluid py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
            <Separator className="mb-8" />
            
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-deal-light p-3 w-fit mb-4">
                    <MessageSquare className="h-6 w-6 text-deal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                  <p className="text-gray-600 mb-4">Have a question about a deal or need help with your account? Our support team is ready to assist you.</p>
                  <a href="mailto:support@dealfinder.com" className="text-deal hover:underline">support@dealfinder.com</a>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-deal-light p-3 w-fit mb-4">
                    <Mail className="h-6 w-6 text-deal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Business Inquiries</h3>
                  <p className="text-gray-600 mb-4">Interested in partnering with us or featuring your deals on our platform? Let's talk business.</p>
                  <a href="mailto:business@dealfinder.com" className="text-deal hover:underline">business@dealfinder.com</a>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="border border-gray-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Phone className="h-8 w-8 text-deal mb-2" />
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <MapPin className="h-8 w-8 text-deal mb-2" />
                  <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">123 Deal Street, Suite 456<br />San Francisco, CA 94103</p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <MessageSquare className="h-8 w-8 text-deal mb-2" />
                  <h3 className="font-medium text-gray-900 mb-1">Social Media</h3>
                  <p className="text-gray-600">Connect with us on social media for the latest updates.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deal focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deal focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deal focus:border-transparent"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deal focus:border-transparent resize-none"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button type="submit" className="bg-deal hover:bg-deal-hover">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
