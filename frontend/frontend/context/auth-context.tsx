"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  emailId: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (data: { name: string; emailId: string; password: string; role: string }) => Promise<void>
  signIn: (emailId: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("auth_user")
      }
    }
    setLoading(false)
  }, [])

  const signUp = async ({ name, emailId, password, role }: { name: string; emailId: string; password: string; role: string }) => {
  try {
    const response = await fetch("http://localhost:7500/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emailId, password, role }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Sign up failed");

    // ✅ Your backend sends "employee", not "user"
    const userData = data.employee;
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  } catch (error) {
    console.error("SignUp error:", error);
    throw error;
  }
};

const signIn = async (emailId: string, password: string): Promise<User> => {
  try {
    const response = await fetch("http://localhost:7500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Sign in failed");

    // ✅ Map backend employee data correctly
    const userData: User = {
      _id: data.employee._id,
      name: data.employee.name,
      emailId: data.employee.emailId,
      role: data.employee.role,
    };

    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("SignIn error:", error);
    throw error;
  }
};


  const signOut = async () => {
    try {
      await fetch("http://localhost:7500/logout", { method: "POST" })
      setUser(null)
      localStorage.removeItem("auth_user")
    } catch (error) {
      console.error("SignOut error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
