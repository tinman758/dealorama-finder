
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        setError(error.message)
      } else {
        // Successful authentication
        navigate('/', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-deal hover:bg-deal-hover text-white px-4 py-2 rounded"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Completing Authentication...</h1>
            <div className="w-16 h-16 border-4 border-t-deal rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage
