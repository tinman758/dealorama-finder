
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Heart, Settings, Key, LayoutDashboard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AccountPage = () => {
  const { user, isLoading } = useAuth();
  const { isAdmin } = useAdminCheck();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Account Navigation */}
          <div className="col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-white">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                    <AvatarFallback className="bg-penny-blue text-white text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col max-w-[180px]">
                    <CardTitle className="text-lg">
                      {user.user_metadata?.name || 'User'}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col space-y-1">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/account/security" className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Security
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/account/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  
                  {isAdmin && (
                    <Button variant="ghost" className="justify-start text-penny-blue" asChild>
                      <Link to="/admin" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{user.user_metadata?.name || 'Not set'}</p>
                    </div>
                  </div>
                  <Button className="mt-6" asChild>
                    <Link to="/account/settings">Edit Profile</Link>
                  </Button>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium">Account Activity</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Account created on {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-4">
                    <Link to="/favorites" className="text-penny-blue hover:underline">
                      View your favorite deals
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountPage;
