
import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { users } from '@/data/staticData'

type User = {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}

type Session = {
  user: User;
}

type AuthError = {
  message: string;
}

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, meta?: { name?: string }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  makeAdmin: (userId: string, role?: string) => Promise<boolean>
  removeAdmin: (adminId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Use localStorage to maintain session across page refreshes
const STORAGE_KEY = 'penny-pinchers-auth-storage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setUser(parsedSession.user);
        setSession(parsedSession);
      } catch (e) {
        console.error('Error parsing stored session:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, meta?: { name?: string }) => {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { error: { message: 'User with this email already exists' } };
      }
      
      // In a real app, we would create a new user in the database
      // For now, just simulate a successful registration
      toast.success('Registration successful! Please check your email to confirm your account.');
      navigate('/signup-success');
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: { message: 'An error occurred during sign up' } };
    }
  }

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Find user with matching credentials
      const matchedUser = users.find(u => u.email === email && u.password === password);
      
      if (!matchedUser) {
        return { error: { message: 'Invalid email or password' } };
      }
      
      // Create user object without the password
      const authenticatedUser: User = {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        isAdmin: matchedUser.isAdmin
      };
      
      // Create session
      const newSession = { user: authenticatedUser };
      
      // Store in state
      setUser(authenticatedUser);
      setSession(newSession);
      
      // Store in localStorage if rememberMe is true
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      }
      
      toast.success('Successfully logged in', {
        description: 'Welcome back to DealFinder!',
        position: 'top-center',
        duration: 2000,
        className: 'bg-white text-deal-dark shadow-md',
        icon: '👋',
        style: {
          border: '1px solid rgba(23, 105, 232, 0.2)',
          borderRadius: '0.75rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        },
        closeButton: false
      });
      
      navigate('/');
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: { message: 'An error occurred during sign in' } };
    }
  }

  const signOut = async () => {
    try {
      // Clear state
      setUser(null);
      setSession(null);
      
      // Remove from localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success("Successfully signed out");
      navigate('/login', { replace: true });
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      toast.error("An unexpected error occurred while signing out");
    }
  }

  const makeAdmin = async (userId: string, role: string = 'editor') => {
    try {
      // This would update a database in a real app
      toast.success('User successfully made an admin');
      return true;
    } catch (error) {
      console.error('Error in makeAdmin:', error);
      toast.error('An error occurred while making user an admin');
      return false;
    }
  }

  const removeAdmin = async (adminId: string) => {
    try {
      // This would update a database in a real app
      toast.success('Admin privileges successfully removed');
      return true;
    } catch (error) {
      console.error('Error in removeAdmin:', error);
      toast.error('An error occurred while removing admin privileges');
      return false;
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    makeAdmin,
    removeAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
