
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ProfileFormValues = {
  name: string;
  email: string;
}

const AccountSettingsPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileFormValues>();
  
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="w-16 h-16 border-4 border-t-deal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Card>
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
    </div>
  );
};

export default AccountSettingsPage;
