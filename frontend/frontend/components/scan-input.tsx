"use client"

import type React from "react"

import { useState } from "react"

interface ScanInputProps {
  onScan: (rfid: string) => void
  disabled?: boolean
}

export function ScanInput({ onScan, disabled }: ScanInputProps) {
  const [scannedRfid, setScannedRfid] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && scannedRfid.trim()) {
      onScan(scannedRfid.trim())
      setScannedRfid("")
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="scan" className="block text-sm font-medium text-foreground">
        Scan Item RFID
      </label>
      <input
        id="scan"
        type="text"
        value={scannedRfid}
        onChange={(e) => setScannedRfid(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scan RFID tag..."
        disabled={disabled}
        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        autoFocus
      />
      <p className="text-xs text-muted-foreground">Press Enter to scan</p>
    </div>
  )
}
