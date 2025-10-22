"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
}

interface AdminUser {
  id: string
  username: string
  role: "admin"
}

interface AuthContextType {
  user: User | null
  admin: AdminUser | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  adminSignIn: (username: string, password: string) => Promise<void>
  adminSignOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    const storedAdmin = localStorage.getItem("auth_admin")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("auth_user")
      }
    }

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch (e) {
        localStorage.removeItem("auth_admin")
      }
    }

    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Sign up failed")
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Sign in failed")
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      setUser(null)
      localStorage.removeItem("auth_user")
    } catch (error) {
      throw error
    }
  }

  const adminSignIn = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Admin sign in failed")
      }

      const data = await response.json()
      setAdmin(data.admin)
      localStorage.setItem("auth_admin", JSON.stringify(data.admin))
    } catch (error) {
      throw error
    }
  }

  const adminSignOut = async () => {
    try {
      await fetch("/api/auth/admin/signout", { method: "POST" })
      setAdmin(null)
      localStorage.removeItem("auth_admin")
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, admin, loading, signUp, signIn, signOut, adminSignIn, adminSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
