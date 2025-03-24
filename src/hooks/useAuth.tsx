
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
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Get the current origin to use for redirects, ensuring it's not localhost
  const getRedirectURL = () => {
    const currentURL = window.location.origin
    // For development and testing, you can manually override this if needed
    // or use the actual deployed URL when in production
    return currentURL
  }

  useEffect(() => {
    // Check active session
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign up with email and password
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
        // Redirect to success page instead of showing toast
        navigate('/signup-success')
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: error as AuthError }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (!error) {
        toast.success('Login successful!', {
          description: 'Redirecting to your dashboard...'
        })
        navigate('/')
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: error as AuthError }
    }
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
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
