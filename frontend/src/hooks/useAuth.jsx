import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) {
      // Optionally validate / fetch profile
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      // example: fetch user info
      // axios.get('/api/auth/me').then(r => setUser(r.data))
      setUser({ email: 'demo@user.com' }) // placeholder until backend exists
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common.Authorization
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (jwt) => {
    setToken(jwt)
  }
  const logout = () => setToken('')

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
