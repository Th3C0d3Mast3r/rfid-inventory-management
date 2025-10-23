// frontend/app/api/inventory/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:7500/api/inventory/items";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "Missing item id" }, { status: 400 });

    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("PUT /api/inventory/items/[id] failed:", err);
    return NextResponse.json({ error: err.message || "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    // await the params
    const { params } = context;
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "Missing item id" }, { status: 400 });

    const res = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("DELETE /api/inventory/items/[id] failed:", err);
    return NextResponse.json({ error: err.message || "Failed to delete item" }, { status: 500 });
  }
}
