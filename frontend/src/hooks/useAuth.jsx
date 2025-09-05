"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DEMO_USERS } from "../constants/demoUsers"

// Create the auth context
const AuthContext = createContext()

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
      } catch (err) {
        console.error("Error parsing user data:", err)
        localStorage.removeItem("srms_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (identifier, password) => {
    // Check demo users first
    let userData = DEMO_USERS.find(u => 
      (u.username === identifier || u.studentId === identifier) && 
      u.password === password
    );

    // If not found in demo users, check registered students
    if (!userData) {
      const registeredStudents = JSON.parse(localStorage.getItem('srms_students') || '[]');
      const student = registeredStudents.find(s => 
        (s.email === identifier || s.studentId === identifier) && 
        s.password === password
      );

      if (student) {
        userData = {
          id: student.id || `stu_${Date.now()}`,
          username: student.email,
          email: student.email,
          role: 'student',
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          program: student.program
        };
      }
    } else {
      // Format demo user data to match our structure
      userData = {
        id: userData.id,
        username: userData.username,
        email: userData.username, // Using username as email for demo users
        role: userData.role,
        name: userData.name,
        studentId: userData.studentId
      };
    }

    if (userData) {
      localStorage.setItem("srms_user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    return false;
  }

  const logout = () => {
    localStorage.removeItem("srms_user")
    setUser(null)
    navigate("/login")
  }

  const value = {
    user,
    currentUser: user,
    loading: isLoading,
    isLoading, // Add both for compatibility
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Only export the hook and provider, not the context directly
