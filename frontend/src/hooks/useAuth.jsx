"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Create the auth context
export const AuthContext = createContext()

// Demo users data
const DEMO_USERS = [
  {
    id: "1",
    username: "admin@srms.edu",
    password: "admin123",
    role: "administrator",
    name: "Administrator",
  },
  {
    id: "2",
    username: "student@srms.edu",
    password: "student123",
    role: "student",
    name: "John Doe",
    studentId: "STU001",
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("srms_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("srms_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    const demoUser = DEMO_USERS.find((u) => u.username === email && u.password === password)

    if (demoUser) {
      const userData = {
        id: demoUser.id,
        username: demoUser.username,
        role: demoUser.role,
        name: demoUser.name,
        studentId: demoUser.studentId,
      }

      localStorage.setItem("srms_user", JSON.stringify(userData))
      setUser(userData)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem("srms_user")
    setUser(null)
    navigate("/login")
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
