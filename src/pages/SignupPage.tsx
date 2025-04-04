
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

import AuthLayout from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define form validation schema with stronger password validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).trim(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).trim().toLowerCase(),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string(),
  termsAndConditions: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SignupPage = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  // Password strength indicator
  const password = form.watch("password");
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500", 
    "bg-orange-500", 
    "bg-yellow-500", 
    "bg-blue-500", 
    "bg-green-500"
  ];

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Sanitize data before sending to backend
      const { error } = await signUp(
        values.email, 
        values.password,
        { name: values.name.trim() }
      );
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      form.reset();
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = error?.message || "Please try again or contact support if the problem persists";
      
      // Display appropriate error message
      if (error?.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please log in instead.";
      }
      
      toast.error("Signup failed", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an Account"
      subtitle="Join DealFinder to save your favorite deals and get personalized recommendations"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="John Doe" 
                      className="pl-10" 
                      autoComplete="name"
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
                      autoComplete="email"
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
                <FormLabel className="flex items-center justify-between">
                  <span>Password</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-normal text-gray-400 flex items-center cursor-help">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          Password Requirements
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul className="text-xs list-disc pl-4 space-y-1">
                          <li>At least 6 characters</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one lowercase letter</li>
                          <li>At least one number</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10" 
                      autoComplete="new-password"
                      {...field} 
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                      {[...Array(5)].map((_, index) => (
                        <div 
                          key={index} 
                          className={`h-full w-1/5 ${index < passwordStrength ? strengthColor[index] : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Strength: {passwordStrength > 0 ? strengthLabel[passwordStrength - 1] : "Very Weak"}
                    </p>
                  </div>
                )}
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10" 
                      autoComplete="new-password"
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
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal text-sm">
                    I agree to the <Link to="/terms" className="text-deal underline">Terms of Service</Link> and <Link to="/privacy" className="text-deal underline">Privacy Policy</Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-deal hover:bg-deal-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-deal font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <Alert>
          <AlertDescription className="text-xs text-gray-600">
            By creating an account, you'll get access to exclusive deals, personalized recommendations, 
            and notifications for your favorite stores and products.
          </AlertDescription>
        </Alert>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
