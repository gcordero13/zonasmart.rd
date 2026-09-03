import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, onAuthStateChange } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getCurrentUser().then((currentUser) => {
      if (mounted) {
        setUser(currentUser)
        setLoading(false)
      }
    })

    const { data: subscription } = onAuthStateChange((nextUser) => {
      if (mounted) setUser(nextUser)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
