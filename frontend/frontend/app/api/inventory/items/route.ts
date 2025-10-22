import { type NextRequest, NextResponse } from "next/server"

// In production, this would query your actual database
const DUMMY_ITEMS = [
  { rfid: "RFID001", name: "APSARA PENCIL SET", quantity: 45, scannedAt: new Date().toISOString() },
  { rfid: "RFID002", name: "NOTEBOOK A4", quantity: 120, scannedAt: new Date().toISOString() },
]

export async function GET(request: NextRequest) {
  try {
    // In real backend: fetch from database with user authentication
    return NextResponse.json({ items: DUMMY_ITEMS }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rfid, name, quantity } = await request.json()

    if (!rfid || !name) {
      return NextResponse.json({ error: "RFID and name required" }, { status: 400 })
    }

    // In real backend: save to database
    const newItem = {
      rfid,
      name,
      quantity: quantity || 1,
      scannedAt: new Date().toISOString(),
    }

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
