"use client"

import type { Employee } from "@/types/inventory"

interface EmployeesListProps {
  employees: Employee[]
  loading?: boolean
}

export function EmployeesList({ employees, loading = false }: EmployeesListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No employees registered yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Employee ID</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Department</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Registered</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 text-foreground">{employee.name}</td>
              <td className="py-3 px-4 text-foreground font-mono text-xs">{employee.employeeId}</td>
              <td className="py-3 px-4 text-foreground">{employee.email}</td>
              <td className="py-3 px-4 text-foreground">{employee.department}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  {employee.role}
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {new Date(employee.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
