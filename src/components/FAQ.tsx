
import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

// FAQ data structure
const faqItems = [
  {
    question: "How do I use a coupon code?",
    answer: "To use a coupon code, copy it from our site, then visit the retailer's website. During checkout, look for a field labeled 'Coupon Code', 'Promo Code', or 'Discount Code'. Paste your code there and apply it before completing your purchase."
  },
  {
    question: "Are all the deals verified?",
    answer: "Yes, we verify all deals before publishing them on our platform. Our team regularly checks that the coupons and promotions are valid and up-to-date. However, deals can expire quickly, so we recommend using them as soon as possible."
  },
  {
    question: "How often are new deals added?",
    answer: "We add new deals daily. Our team is constantly searching for the best discounts and promotions across various categories. We prioritize quality over quantity to ensure our users get access to truly valuable savings."
  },
  {
    question: "Do I need to create an account to use the deals?",
    answer: "No, you don't need to create an account to browse or use the deals on our platform. However, creating a free account allows you to save your favorite deals, receive personalized recommendations, and get notifications about upcoming sales."
  },
  {
    question: "What should I do if a coupon doesn't work?",
    answer: "If a coupon doesn't work, first check that you've copied the code correctly and that you meet all the conditions (minimum purchase, specific items, etc.). If it still doesn't work, please contact us through our 'Contact Us' page, and we'll investigate the issue."
  },
  {
    question: "Can I submit a deal I found elsewhere?",
    answer: "Absolutely! We welcome deal submissions from our users. Use the 'Submit a Deal' form on our website, and our team will review your submission. If approved, it will be added to our platform, and we'll give you credit for finding it."
  }
];

const FAQ = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-fluid">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-deal-light mb-4">
            <HelpCircle className="h-6 w-6 text-deal" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions about how to use our deals and coupons? Find quick answers to common questions below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-soft">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
