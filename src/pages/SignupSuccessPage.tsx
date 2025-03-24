
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthLayout from '@/components/auth/AuthLayout';

const SignupSuccessPage = () => {
  return (
    <AuthLayout
      title="Registration Successful!"
      subtitle="Your account has been created"
    >
      <Card className="border-none shadow-none">
        <CardContent className="pt-6 pb-4 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-center">Email Verification Required</h2>
            <p className="text-gray-500 text-center">
              We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg text-sm text-amber-800 flex items-start space-x-3">
            <Mail className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Check your inbox and spam folder</p>
              <p className="mt-1">If you don't see the email within a few minutes, check your spam folder or request a new verification email.</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button asChild className="w-full bg-deal hover:bg-deal-hover">
            <Link to="/login">
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <p className="text-sm text-center text-gray-500">
            Need help? <Link to="/contact" className="text-deal hover:underline">Contact Support</Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default SignupSuccessPage;
