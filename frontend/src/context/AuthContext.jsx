import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try{
      const res = await api.get('/api/auth/me')
      setUser(res.data.user || null)
    }catch(_err){
      setUser(null)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    refreshUser()
  },[])

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  const logout = async () => {
    try{
      await api.post('/api/auth/logout')
    }finally{
      setUser(null)
      window.location.href = '/'
    }
  }

  const value = useMemo(() => ({ user, loading, refreshUser, loginWithGoogle, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
