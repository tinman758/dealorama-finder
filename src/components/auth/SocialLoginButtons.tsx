
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SocialLoginButtonsProps {
  action: 'login' | 'signup';
}

const SocialLoginButtons = ({ action }: SocialLoginButtonsProps) => {
  const { signInWithSocial } = useAuth();
  const [isLoading, setIsLoading] = useState<Provider | null>(null);
  const [showSupabaseAlert, setShowSupabaseAlert] = useState(false);

  // Handle social login with improved error handling
  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(provider);
    
    try {
      const result = await signInWithSocial(provider);
      
      if (result?.error) {
        // Handle error based on type
        if (result.error.message?.includes('Supabase not configured')) {
          setShowSupabaseAlert(true);
          toast.error('Supabase configuration missing', {
            description: 'Please set up your Supabase environment variables'
          });
        } else {
          toast.error(`${provider} login failed`, {
            description: result.error.message || 'Please try again or use email login'
          });
        }
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login failed`, {
        description: 'Please try again or use email login'
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {showSupabaseAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Supabase connection is not configured. Please check your environment variables.
          </AlertDescription>
        </Alert>
      )}

      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading !== null}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
          <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970134 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
          <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
          <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
        </svg>
        {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={() => handleSocialLogin('facebook')}
        disabled={isLoading !== null}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        {isLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={() => handleSocialLogin('apple')}
        disabled={isLoading !== null}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.687 3.559-1.701z"/>
        </svg>
        {isLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
