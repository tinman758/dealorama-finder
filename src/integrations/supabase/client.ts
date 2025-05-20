
// Static mock implementation of the Supabase client
// This provides a non-functional API surface that prevents runtime errors

const mockClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: {
          unsubscribe: () => {}
        } 
      } 
    }),
    signUp: () => Promise.resolve({ data: {}, error: null }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        in: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
        or: () => Promise.resolve({ data: [], error: null }),
        ilike: () => Promise.resolve({ data: [], error: null })
      }),
      in: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      limit: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({})
    })
  }),
  removeChannel: () => {}
};

export const supabase = mockClient;

// Mock admin check function
export const isAdmin = async (userId: string | undefined): Promise<boolean> => {
  // In our static version, admin status is determined by the mock user data
  return userId === '1';
};
