"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { SignUpForm } from "@/components/signup-form"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">IoT Inventory</h1>
          <p className="text-muted-foreground">Manage your inventory with ease</p>
        </div>

        {isSignUp ? (
          <>
            <SignUpForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline font-medium">
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline font-medium">
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
