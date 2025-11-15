import { NextRequest, NextResponse } from "next/server";

let lastScannedUID: string | null = null;

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "No UID provided" }, { status: 400 });

    lastScannedUID = uid;
    console.log("Scanned UID received:", uid);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/scan failed:", err);
    return NextResponse.json({ error: "Failed to register UID" }, { status: 500 });
  }
}

// Return UID once and clear it so frontend can fetch it exactly once
export async function GET() {
  const uid = lastScannedUID;
  lastScannedUID = null;
  return NextResponse.json({ uid });
}
