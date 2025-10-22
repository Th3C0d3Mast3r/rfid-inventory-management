"use client"

import type React from "react"

import { useState } from "react"
import type { Employee } from "@/types/inventory"

interface EmployeeRegistrationFormProps {
  onSubmit: (employee: Omit<Employee, "id" | "createdAt">) => Promise<void>
  loading?: boolean
}

export function EmployeeRegistrationForm({ onSubmit, loading = false }: EmployeeRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    role: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.name || !formData.email || !formData.employeeId || !formData.department || !formData.role) {
      setError("All fields are required")
      return
    }

    try {
      await onSubmit(formData)
      setSuccess("Employee registered successfully!")
      setFormData({ name: "", email: "", employeeId: "", department: "", role: "" })
    } catch (err) {
      setError("Failed to register employee")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="employeeId" className="block text-sm font-medium text-foreground mb-2">
          Employee ID
        </label>
        <input
          id="employeeId"
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="EMP-001"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-foreground mb-2">
          Department
        </label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Warehouse"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          required
        >
          <option value="">Select a role</option>
          <option value="scanner">Scanner</option>
          <option value="supervisor">Supervisor</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-200">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Registering..." : "Register Employee"}
      </button>
    </form>
  )
}
