
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Mail, MapPin, Phone } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name cannot exceed 50 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters."
  }).max(100, {
    message: "Subject cannot exceed 100 characters."
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters."
  }).max(1000, {
    message: "Message cannot exceed 1000 characters."
  })
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      // Simulating an API call
      console.log("Form submitted with:", values);
      
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible."
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message", {
        description: "Please try again later or contact us directly."
      });
    }
  };

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your email" 
                              type="email"
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Message subject" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message" 
                            rows={5}
                            className="resize-none"
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="bg-deal hover:bg-deal-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
