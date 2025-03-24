
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import AuthLayout from '@/components/auth/AuthLayout';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import AuthDivider from '@/components/auth/AuthDivider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form validation schema with stronger validation
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).trim().toLowerCase(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission with security considerations
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Implement rate limiting - in real implementation this would be server-side
    if (loginAttempts >= 5) {
      toast.error("Too many login attempts", {
        description: "Please try again later or reset your password"
      });
      return;
    }
    
    setIsSubmitting(true);
    setLoginAttempts(prev => prev + 1);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        toast.error("Login failed", {
          description: error.message || "Please check your credentials and try again"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: "Please check your credentials and try again"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show warning if too many login attempts
  const showRateLimitWarning = loginAttempts >= 3;

  return (
    <AuthLayout 
      title="Log In to DealFinder"
      subtitle="Welcome back! Log in to access your saved deals and personalized recommendations"
    >
      <SocialLoginButtons action="login" />
      <AuthDivider />

      {showRateLimitWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Multiple failed login attempts detected. Your account will be temporarily locked after {5 - loginAttempts} more attempts.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="you@example.com" 
                      className="pl-10" 
                      autoComplete="username" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      autoComplete="current-password"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <Link to="/forgot-password" className="text-sm font-medium text-deal hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-deal hover:bg-deal-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-deal font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs text-gray-600">
            By logging in, you'll get access to exclusive deals, saved favorites, 
            and personalized deal alerts based on your preferences.
          </AlertDescription>
        </Alert>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
