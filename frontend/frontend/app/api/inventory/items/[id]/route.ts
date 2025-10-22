import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, quantity } = await request.json()
    const rfid = params.id

    // In real backend: update database record
    const updatedItem = {
      rfid,
      name: name || "Unknown Item",
      quantity: quantity || 0,
      scannedAt: new Date().toISOString(),
    }

    return NextResponse.json({ item: updatedItem }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rfid = params.id

    // In real backend: delete from database
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
