
import { createClient } from '@supabase/supabase-js'

// Extract environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file or Supabase connection.')
}

// Create a dummy client for development if no credentials are available
// This prevents the app from crashing but authentication won't work
const createSupabaseClient = () => {
  try {
    // Only create client if we have both URL and key
    if (supabaseUrl && supabaseAnonKey) {
      return createClient(supabaseUrl, supabaseAnonKey)
    } else {
      // Return a mock client that logs operations but doesn't break the app
      // This is just for development to prevent crashes
      console.warn('Using mock Supabase client. Authentication will not work.')
      
      const mockClient = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ 
            data: { subscription: { unsubscribe: () => {} } } 
          }),
          signUp: async () => ({ error: { message: 'Supabase not configured' } }),
          signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
          signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
          signOut: async () => ({ error: null })
        }
      }
      return mockClient as any
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error)
    throw error
  }
}

export const supabase = createSupabaseClient()
