"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  user_role: "usuario" | "escuderia" | "administrador"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isTeam: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (name: string, email: string) => Promise<void>
  deleteAccount: () => Promise<void>
  getAllUsers: () => User[]
  updateUser: (userId: string, name: string, userRole: string) => void
  deleteUser: (userId: string) => void
  createUser: (name: string, email: string, userRole: "usuario" | "escuderia" | "administrador") => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cuentas hardcodeadas como solicitó el usuario
const DEFAULT_USERS: User[] = [
  {
    id: "1",
    name: "Usuario Demo",
    email: "usuario@f1.com",
    user_role: "usuario" as const,
  },
  {
    id: "2", 
    name: "Escudería F1",
    email: "escuderia@f1",
    user_role: "escuderia" as const,
  },
  {
    id: "3",
    name: "Administrador F1", 
    email: "admin@f1",
    user_role: "administrador" as const,
  },
]

// Función para detectar rol basado en el email
const detectUserRole = (email: string): "usuario" | "escuderia" | "administrador" => {
  const emailLower = email.toLowerCase().trim()
  
  // Cuentas específicas hardcodeadas
  if (emailLower === "admin") {
    return "administrador"
  }
  
  if (emailLower === "escuderia") {
    return "escuderia"
  }
  
  // Detección por patrones para otros emails
  if (emailLower.includes("admin") || emailLower.includes("administrador")) {
    return "administrador"
  }
  
  if (emailLower.includes("escuderia") || emailLower.includes("team") || emailLower.includes("equipo")) {
    return "escuderia"
  }
  
  // Por defecto es usuario
  return "usuario"
}

const DEFAULT_PASSWORD = "123456"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Inicializar usuarios por defecto si no existen
    const storedUsers = localStorage.getItem("f1_users")
    if (!storedUsers) {
      localStorage.setItem("f1_users", JSON.stringify(DEFAULT_USERS))
    }

    // Cargar usuario actual si existe
    const storedUser = localStorage.getItem("f1_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Asegurar que el usuario tenga el rol correcto
        const correctRole = detectUserRole(parsedUser.email)
        const completeUser: User = {
          ...parsedUser,
          user_role: correctRole
        }
        setUser(completeUser)
        localStorage.setItem("f1_user", JSON.stringify(completeUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("f1_user")
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const foundUser = allUsers.find((u: User) => u.email === email)

    if (!foundUser) {
      alert("Usuario no encontrado")
      throw new Error("Usuario no encontrado")
    }

    if (password !== DEFAULT_PASSWORD) {
      alert("Contraseña incorrecta. Usa: 123456")
      throw new Error("Contraseña incorrecta")
    }

    // Asignar el rol correcto basado en el email
    const userWithRole = { 
      ...foundUser, 
      user_role: detectUserRole(email) 
    }
    
    // Actualizar en el array de usuarios
    const updatedUsers = allUsers.map((u: User) => 
      u.email === email ? userWithRole : u
    )
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))
    
    setUser(userWithRole)
    localStorage.setItem("f1_user", JSON.stringify(userWithRole))
  }

  const register = async (name: string, email: string, password: string) => {
    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const existingUser = allUsers.find((u: User) => u.email === email)
    if (existingUser) {
      alert("El email ya está registrado")
      throw new Error("El email ya está registrado")
    }

    // Detectar automáticamente el rol basado en el email
    const detectedRole = detectUserRole(email)

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      user_role: detectedRole,
    }

    const updatedUsers = [...allUsers, newUser]
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))
    
    setUser(newUser)
    localStorage.setItem("f1_user", JSON.stringify(newUser))
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("f1_user")
  }

  const updateProfile = async (name: string, email: string) => {
    if (!user) return

    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const updatedUser = { ...user, name, email, user_role: detectUserRole(email) }
    const updatedUsers = allUsers.map((u: User) => (u.id === user.id ? updatedUser : u))

    setUser(updatedUser)
    localStorage.setItem("f1_user", JSON.stringify(updatedUser))
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))
  }

  const deleteAccount = async () => {
    if (!user) return

    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const updatedUsers = allUsers.filter((u: User) => u.id !== user.id)
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))

    setUser(null)
    localStorage.removeItem("f1_user")
  }

  const getAllUsers = () => {
    const storedUsers = localStorage.getItem("f1_users")
    return storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS
  }

  const updateUser = (userId: string, name: string, userRole: string) => {
    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const updatedUsers = allUsers.map((u: User) =>
      u.id === userId ? { ...u, name, user_role: userRole as "usuario" | "escuderia" | "administrador" } : u,
    )
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))

    if (user?.id === userId) {
      const updatedCurrentUser = updatedUsers.find((u: User) => u.id === userId)
      if (updatedCurrentUser) {
        setUser(updatedCurrentUser)
        localStorage.setItem("f1_user", JSON.stringify(updatedCurrentUser))
      }
    }
  }

  const deleteUser = (userId: string) => {
    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    const updatedUsers = allUsers.filter((u: User) => u.id !== userId)
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))
  }

  const createUser = (name: string, email: string, userRole: "usuario" | "escuderia" | "administrador"): boolean => {
    const storedUsers = localStorage.getItem("f1_users")
    const allUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS

    // Verificar si el email ya existe
    const existingUser = allUsers.find((u: User) => u.email === email)
    if (existingUser) {
      return false // Email ya existe
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      user_role: userRole,
    }

    const updatedUsers = [...allUsers, newUser]
    localStorage.setItem("f1_users", JSON.stringify(updatedUsers))
    
    return true // Usuario creado exitosamente
  }

  const isAdmin = user?.user_role === "administrador"
  const isTeam = user?.user_role === "escuderia"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isTeam,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        getAllUsers,
        updateUser,
        deleteUser,
        createUser,
      }}
    >
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
