
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-glossy p-8 text-center border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Completing Authentication...</h1>
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-deal opacity-20 rounded-full animate-pulse"></div>
              <Loader2 className="w-24 h-24 mx-auto animate-spin text-deal" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we verify your credentials</p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              <AlertTitle className="text-lg font-semibold">Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/login')}
              className="mt-6 w-full bg-deal hover:bg-deal-hover text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Authentication Successful!</h1>
            <p className="text-gray-600 dark:text-gray-300">You will be redirected to the home page momentarily...</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden mt-6">
              <div className="bg-green-500 h-1 animate-pulse rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage
