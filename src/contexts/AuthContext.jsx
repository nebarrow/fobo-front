import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { getToken, clearTokens } from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const data = await authApi.getProfile()
      setUser(data.user || data)
    } catch {
      setUser(null)
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const sendCode = async (phone) => {
    return authApi.sendCode(phone)
  }

  const verifyCode = async (phone, code) => {
    const data = await authApi.verify(phone, code)
    setUser(data.user)
    return data
  }

  const register = async (phone, code, name) => {
    const data = await authApi.register(phone, code, name)
    setUser(data.user)
    return data
  }

  const updateUser = async (updates) => {
    const data = await authApi.updateProfile(updates)
    setUser(data.user || data)
    return data
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, sendCode, verifyCode, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
