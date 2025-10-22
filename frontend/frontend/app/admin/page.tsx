"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { EmployeeRegistrationForm } from "@/components/employee-registration-form"
import { EmployeesList } from "@/components/employees-list"
import type { Employee } from "@/types/inventory"

export default function AdminPage() {
  const { admin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !admin) {
      router.push("/")
    }
  }, [admin, authLoading, router])

  useEffect(() => {
    if (admin) {
      fetchEmployees()
    }
  }, [admin])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.employees)
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterEmployee = async (employeeData: Omit<Employee, "id" | "createdAt">) => {
    try {
      setLoading(true)
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees((prev) => [...prev, data.employee])
      } else {
        throw new Error("Failed to register employee")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
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
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Register Employee</h2>
              <EmployeeRegistrationForm onSubmit={handleRegisterEmployee} loading={loading} />
            </div>
          </div>

          {/* Employees List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Registered Employees</h2>
              <EmployeesList employees={employees} loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
