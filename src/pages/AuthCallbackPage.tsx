
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // For a static app, we just simulate a successful login
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-glossy p-8 text-center border border-gray-100 dark:border-gray-700">
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
      </div>
    </div>
  )
}

export default AuthCallbackPage
