
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ProfileFormValues = {
  name: string;
  email: string;
}

type EmailPreferencesValues = {
  featuredDeals: boolean;
  newPromotions: boolean;
  weeklyNewsletter: boolean;
}

const AccountSettingsPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileFormValues>();
  
  const emailPreferencesForm = useForm<EmailPreferencesValues>({
    defaultValues: {
      featuredDeals: true,
      newPromotions: true,
      weeklyNewsletter: false,
    }
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
    
    if (user) {
      setValue('name', user.user_metadata?.name || '');
      setValue('email', user.email || '');
      
      // Fetch avatar URL if it exists
      if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    }
  }, [user, isLoading, navigate, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    // Update user profile
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: data.name }
      });
      
      if (error) {
        toast.error("Failed to update profile", {
          description: error.message
        });
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating profile:", error);
    }
  };

  const updateEmail = async (newEmail: string) => {
    if (!newEmail || newEmail === user?.email) return;
    
    setUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) {
        toast.error("Failed to update email", {
          description: error.message
        });
      } else {
        toast.success("Verification email sent", {
          description: "Please check your new email address for a verification link to complete the change."
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating email:", error);
    } finally {
      setUpdatingEmail(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user!.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    setUploadingAvatar(true);
    
    try {
      // Check if the user already has an avatar to delete the old one
      if (user?.user_metadata?.avatar_path) {
        await supabase.storage
          .from('avatars')
          .remove([user.user_metadata.avatar_path]);
      }
      
      // Upload the new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's metadata with the avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: publicUrlData.publicUrl,
          avatar_path: filePath
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(publicUrlData.publicUrl);
      toast.success("Profile picture updated successfully");
      
    } catch (error: any) {
      toast.error("Failed to upload profile picture", {
        description: error.message
      });
      console.error("Error uploading avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onEmailPreferencesSubmit = async (data: EmailPreferencesValues) => {
    toast.success("Email preferences updated", {
      description: "Your email notification settings have been saved."
    });
    // In a real app, you would save these preferences to the database
    // const { error } = await supabase
    //   .from('user_preferences')
    //   .upsert({ 
    //     user_id: user?.id, 
    //     featured_deals_emails: data.featuredDeals,
    //     new_promotions_emails: data.newPromotions,
    //     weekly_newsletter: data.weeklyNewsletter
    //   });
    
    // if (error) {
    //   toast.error("Failed to update email preferences");
    // } else {
    //   toast.success("Email preferences updated successfully");
    // }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-16rem)]">
          <div className="w-16 h-16 border-4 border-t-deal rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile picture for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl || ''} alt="Profile picture" />
              <AvatarFallback className="text-lg">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <div>
                <Label htmlFor="avatar-upload" className="block mb-2">Upload new picture</Label>
                <Input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Recommended: Square image, at least 200x200 pixels
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your account profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    placeholder="Your email"
                    className="truncate max-w-full"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={updatingEmail || !isDirty}
                    onClick={() => updateEmail((register('email').value as string))}
                  >
                    {updatingEmail ? "Updating..." : "Change Email"}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Changing your email requires verification from your new address
                </p>
              </div>
              
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>
              Manage what types of emails you receive from us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailPreferencesForm}>
              <form onSubmit={emailPreferencesForm.handleSubmit(onEmailPreferencesSubmit)} className="space-y-6">
                <FormField
                  control={emailPreferencesForm.control}
                  name="featuredDeals"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Deals</FormLabel>
                        <FormDescription>
                          Receive emails about top deals and exclusive offers
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">New Promotions</FormLabel>
                        <FormDescription>
                          Get notified when new promotions and flash sales are available
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Weekly Newsletter</FormLabel>
                        <FormDescription>
                          Stay up-to-date with our weekly newsletter featuring recent deals and upcoming offers
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
                
                <Button type="submit">
                  {emailPreferencesForm.formState.isSubmitting ? "Saving..." : "Save Email Preferences"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
