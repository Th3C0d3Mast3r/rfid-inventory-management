import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // DUMMY DATA - Replace with real database query
    const employees = JSON.parse(localStorage.getItem("employees") || "[]")
    return NextResponse.json({ employees }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const employee = await request.json()

    // DUMMY STORAGE - Replace with real database insert
    const employees = JSON.parse(localStorage.getItem("employees") || "[]")
    const newEmployee = {
      id: `emp-${Date.now()}`,
      ...employee,
      createdAt: new Date().toISOString(),
    }

    employees.push(newEmployee)
    localStorage.setItem("employees", JSON.stringify(employees))

    return NextResponse.json({ employee: newEmployee }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
