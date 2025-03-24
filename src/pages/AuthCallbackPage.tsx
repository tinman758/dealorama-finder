
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Add some console logs to help with debugging
      console.log('Auth callback page loaded')
      console.log('Current URL:', window.location.href)
      
      try {
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
        } else {
          // Successful authentication
          console.log('Authentication successful, redirecting to home')
          navigate('/', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred during authentication.')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {loading ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Completing Authentication...</h1>
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-deal" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-deal hover:bg-deal-hover text-white px-4 py-2 rounded"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-green-600">Authentication Successful!</h1>
            <p>You will be redirected to the home page momentarily...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage
