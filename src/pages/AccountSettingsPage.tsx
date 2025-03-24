
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
    }
  }, [user, isLoading, navigate, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    toast.info("This feature is not yet implemented");
    // In a real app, you would update the user profile here
    // const { error } = await supabase.auth.updateUser({
    //   data: { name: data.name }
    // });
    
    // if (error) {
    //   toast.error("Failed to update profile");
    // } else {
    //   toast.success("Profile updated successfully");
    // }
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
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled
                  placeholder="Your email"
                  className="truncate max-w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. This is your login address.
                </p>
              </div>
              
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
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
