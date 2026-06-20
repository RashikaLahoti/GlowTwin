/**
 * auth-context.tsx
 * Custom JWT Authentication context for GlowTwin AI.
 * Handles JWT token storage, login/logout, auto-refresh, and persistence.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

const API_BASE = (import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined) ?? 'http://localhost:5000/api'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  idToken: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)

  // ── Helper to start refresh timer ──────────────────────────────────────────
  // Refreshes token every 14 minutes (before the 15-minute expiry)
  const setupRefreshTimer = () => {
    const timer = setTimeout(async () => {
      try {
        await refreshToken()
      } catch (err) {
        console.error('[GlowTwin] Auto-refresh failed:', err)
      }
    }, 14 * 60 * 1000)

    return () => clearTimeout(timer)
  }

  // ── Refresh token operation ────────────────────────────────────────────────
  const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data = await response.json()
      setIdToken(data.accessToken)
      return data.accessToken
    } catch {
      setUser(null)
      setIdToken(null)
      return null
    }
  }

  // ── Initialize auth session on mount ────────────────────────────────────────
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await refreshToken()
        if (token) {
          // If we got a token, retrieve the user details
          // Decode simple token payload or let google-mock login endpoint return details
          // To keep it simple, we can fetch user profile or hit /auth/google-mock to retrieve session
          // Let's do a mock Google sign-in check to set user details
          const response = await fetch(`${API_BASE}/auth/google-mock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          if (response.ok) {
            const data = await response.json()
            setUser({
              uid: data.user.id,
              email: data.user.email,
              displayName: data.user.displayName,
            })
            setIdToken(data.accessToken)
          }
        }
      } catch (err) {
        console.warn('[GlowTwin] No active session found')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // ── Setup refresh timer whenever idToken changes ───────────────────────────
  useEffect(() => {
    if (idToken) {
      const cleanup = setupRefreshTimer()
      return () => cleanup()
    }
  }, [idToken])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch(`${API_BASE}/auth/google-mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Google login failed')
      }

      const data = await response.json()
      setUser({
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName,
      })
      setIdToken(data.accessToken)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed'
      console.error('[GlowTwin] Google sign-in error:', message)
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      setUser(null)
      setIdToken(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-out failed'
      console.error('[GlowTwin] Sign-out error:', message)
      setError(message)
      throw err
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, error, idToken, signInWithGoogle, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
