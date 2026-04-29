import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/api.js'
import { clearToken, loadToken, saveToken } from './tokenStorage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => loadToken())
  const [tokenReady, setTokenReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function hydrate() {
      if (!token) {
        setUser(null)
        setTokenReady(true)
        return
      }

      try {
        const data = await apiRequest('/api/auth/me', { token, signal: controller.signal })
        setUser(data.user)
      } catch (err) {
        if (controller.signal.aborted) return
        clearToken()
        setToken(null)
        setUser(null)
      } finally {
        if (!controller.signal.aborted) setTokenReady(true)
      }
    }

    hydrate()
    return () => controller.abort()
  }, [token])

  const value = useMemo(() => {
    return {
      token,
      tokenReady,
      user,
      async signup({ email, password }) {
        const data = await apiRequest('/api/auth/signup', {
          method: 'POST',
          body: { email, password },
        })
        saveToken(data.token)
        setToken(data.token)
        setUser(data.user)
      },
      async login({ email, password }) {
        const data = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        })
        saveToken(data.token)
        setToken(data.token)
        setUser(data.user)
      },
      logout() {
        clearToken()
        setToken(null)
        setUser(null)
      },
    }
  }, [token, tokenReady, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

