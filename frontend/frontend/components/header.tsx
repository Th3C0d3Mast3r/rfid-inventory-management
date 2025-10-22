"use client"

import { useAuth } from "@/context/auth-context"
import { useTheme } from "@/context/theme-context"
import { useRouter } from "next/navigation"
import { Moon, Sun, LogOut } from "lucide-react"

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, admin, signOut, adminSignOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    if (isAdmin) {
      await adminSignOut()
    } else {
      await signOut()
    }
    router.push("/")
  }

  const displayName = isAdmin ? admin?.username : user?.email

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            IoT Inventory {isAdmin && <span className="text-sm text-primary ml-2">(Admin)</span>}
          </h1>
          <p className="text-sm text-muted-foreground">{displayName}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
