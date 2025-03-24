import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const getRedirectURL = () => {
    const currentURL = window.location.origin
    return currentURL
  }

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, meta?: { name?: string }) => {
    try {
      const redirectTo = `${getRedirectURL()}/auth/callback`
      console.log('Using redirect URL:', redirectTo)
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta,
          emailRedirectTo: redirectTo,
        },
      })
      
      if (!error) {
        navigate('/signup-success')
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log("Signing in with rememberMe:", rememberMe);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (!error) {
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
        navigate('/')
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log("Attempting to sign out...")
      
      setUser(null)
      setSession(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Error signing out:", error)
        toast.error("Failed to sign out", {
          description: error.message
        })
        return
      }
      
      console.log("Sign out successful")
      toast.success("Successfully signed out")
      
      navigate('/login', { replace: true })
    } catch (err) {
      console.error("Unexpected error during sign out:", err)
      toast.error("An unexpected error occurred while signing out")
    }
  }

  const makeAdmin = async (userId: string, role: string = 'editor') => {
    try {
      if (!user) {
        toast.error('You must be logged in to perform this action')
        return false
      }
      
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: userId,
          role: role,
          created_at: new Date().toISOString()
        })
        
      if (error) {
        console.error('Error making user admin:', error)
        toast.error('Failed to make user an admin')
        return false
      }
      
      toast.success('User successfully made an admin')
      return true
    } catch (error) {
      console.error('Error in makeAdmin:', error)
      toast.error('An error occurred while making user an admin')
      return false
    }
  }

  const removeAdmin = async (adminId: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to perform this action')
        return false
      }
      
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId)
        
      if (error) {
        console.error('Error removing admin:', error)
        toast.error('Failed to remove admin privileges')
        return false
      }
      
      toast.success('Admin privileges successfully removed')
      return true
    } catch (error) {
      console.error('Error in removeAdmin:', error)
      toast.error('An error occurred while removing admin privileges')
      return false
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
