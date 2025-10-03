"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
  updateProfile: (name: string, email: string) => void
  deleteAccount: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string) => {
    // Simulación de login
    setUser({
      id: "1",
      name: email.split("@")[0],
      email: email,
    })
  }

  const register = (name: string, email: string, password: string) => {
    // Simulación de registro
    setUser({
      id: "1",
      name: name,
      email: email,
    })
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, name, email })
    }
  }

  const deleteAccount = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
