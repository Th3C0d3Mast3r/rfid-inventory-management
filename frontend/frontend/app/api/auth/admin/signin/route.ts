import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // DUMMY VALIDATION - Replace with real backend
    if (username === "admin" && password === "admin") {
      const admin = {
        id: "admin-001",
        username: "admin",
        role: "admin",
      }

      return NextResponse.json({ admin }, { status: 200 })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
