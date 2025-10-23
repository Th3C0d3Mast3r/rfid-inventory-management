"use client"
import { useEffect, useState } from "react"

export function ScanInput({ onScan, disabled }: { onScan: (rfid: string) => void; disabled?: boolean }) {
  const [rfid, setRfid] = useState("")

  // Poll the backend every 500ms for new scan
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/scan")
        const data = await res.json()
        if (data.uid && data.uid !== rfid) {
          setRfid(data.uid)
          onScan(data.uid) // trigger normal scan flow
        }
      } catch (err) {
        console.error("Failed to poll scanned UID:", err)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [rfid, onScan])

  return (
    <input
      type="text"
      value={rfid}
      disabled={disabled}
      placeholder="Scan RFID Tag"
      className="w-full border rounded p-2"
      onChange={(e) => setRfid(e.target.value)}
    />
  )
}
