import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Info, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name cannot be longer than 30 characters.",
    }),
});

const emailFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    }),
});

const emailPreferencesFormSchema = z.object({
  featuredDeals: z.boolean().default(true),
  newPromotions: z.boolean().default(true),
  weeklyNewsletter: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;
type EmailPreferencesFormValues = z.infer<typeof emailPreferencesFormSchema>;

const AccountSettingsPage = () => {
  const { user, session } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const navigate = useNavigate();

  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.user_metadata?.name || '',
  };

  const defaultEmailValues: Partial<EmailFormValues> = {
    email: user?.email || '',
  };

  const defaultEmailPreferences: EmailPreferencesFormValues = {
    featuredDeals: true,
    newPromotions: true,
    weeklyNewsletter: false,
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: defaultEmailValues,
  });

  const emailPreferencesForm = useForm<EmailPreferencesFormValues>({
    resolver: zodResolver(emailPreferencesFormSchema),
    defaultValues: defaultEmailPreferences,
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: data.name }
      });

      if (error) throw error;

      if (avatarFile) {
        await handleAvatarUpload(user as User);
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    if (data.email === user?.email) {
      toast.info("The email address is the same as your current one");
      return;
    }

    setIsUpdatingEmail(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ email: data.email });
      
      if (error) throw error;
      
      toast.success("Verification email sent", {
        description: "Please check your email to confirm the change"
      });
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const onEmailPreferencesSubmit = (data: EmailPreferencesFormValues) => {
    console.log("Email preferences updated:", data);
    toast.success("Email preferences updated successfully");
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    
    setAvatarFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatarUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (user: User) => {
    if (!avatarFile) return null;
    
    setIsUploading(true);
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatarUrl: publicUrl }
      });
      
      if (updateError) throw updateError;
      
      toast.success("Avatar uploaded successfully");
      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          
          <Separator />
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Avatar className="w-24 h-24 relative group">
                      <AvatarImage 
                        src={avatarUrl || user?.user_metadata?.avatarUrl} 
                        alt={user?.user_metadata?.name || "User"} 
                      />
                      <AvatarFallback className="text-2xl">
                        {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label htmlFor="avatar-upload" className="cursor-pointer p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                          <Camera className="h-6 w-6 text-white" />
                          <span className="sr-only">Upload avatar</span>
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                    </Avatar>
                    
                    <div>
                      <h3 className="text-lg font-medium">{user?.user_metadata?.name || "User"}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click on the avatar to upload a new image
                      </p>
                    </div>
                  </div>
                  
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the name that will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : "Update profile"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Address</CardTitle>
                  <CardDescription>
                    Change your email address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Changing your email will require verification. You'll receive an email with a verification link.
                    </AlertDescription>
                  </Alert>
                  
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isUpdatingEmail}>
                        {isUpdatingEmail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending verification...
                          </>
                        ) : "Change email"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Preferences</CardTitle>
                  <CardDescription>
                    Decide what type of emails you'd like to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...emailPreferencesForm}>
                    <form onSubmit={emailPreferencesForm.handleSubmit(onEmailPreferencesSubmit)} className="space-y-4">
                      <FormField
                        control={emailPreferencesForm.control}
                        name="featuredDeals"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Featured Deals</FormLabel>
                              <FormDescription>
                                Receive emails about top deals and limited-time offers.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailPreferencesForm.control}
                        name="newPromotions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">New Promotions</FormLabel>
                              <FormDescription>
                                Get notified about new promotions from your favorite stores.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailPreferencesForm.control}
                        name="weeklyNewsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Weekly Newsletter</FormLabel>
                              <FormDescription>
                                Receive a weekly digest of the best deals and savings.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Save preferences</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
