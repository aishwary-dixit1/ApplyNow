import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'

function App(){
  const { user, loading } = useAuth()

  if(loading){
    return <div className="min-h-screen grid place-items-center text-slate-300">Loading...</div>
  }

  return (
    <div className="app-shell">
      <div className="relative z-10 min-h-screen">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user}/> : <Navigate to="/" />} />
      </Routes>
      </div>
    </div>
  )
}

export default App
