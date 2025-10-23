// frontend/app/api/scan/route.ts
import { NextRequest, NextResponse } from "next/server";

let lastScannedUID: string | null = null;

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "No UID provided" }, { status: 400 });

    lastScannedUID = uid; // store it temporarily
    console.log("Scanned UID received:", uid);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/scan failed:", err);
    return NextResponse.json({ error: "Failed to register UID" }, { status: 500 });
  }
}

// Optional GET route to allow frontend to poll the last UID
export async function GET() {
  return NextResponse.json({ uid: lastScannedUID });
}
