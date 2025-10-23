import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:7500/api/inventory/items"

// Fetch all inventory items
export async function GET() {
  try {
    const response = await fetch(BACKEND_URL)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("GET /api/inventory/items failed:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// Add new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("POST /api/inventory/items failed:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
