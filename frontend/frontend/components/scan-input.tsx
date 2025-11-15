"use client";
import { useState, useEffect } from "react";

interface ScanInputProps {
  onScan: (rfid: string) => void;
  disabled?: boolean; // Control the input (disabled when true)
  stopPolling?: boolean; // Control whether polling should stop
}

export function ScanInput({ onScan, disabled, stopPolling }: ScanInputProps) {
  const [value, setValue] = useState(""); // Input value (manual typing)
  const [loading, setLoading] = useState(false); // Loading state for POST
  const [error, setError] = useState<string | null>(null); // Error handling

  // 🔹 Polling logic to fetch UID every 300ms
  useEffect(() => {
    if (stopPolling || disabled) return; // Stop polling if `stopPolling` or `disabled` is true

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/scan");
        const data = await res.json();

        if (data.uid && data.uid !== value) {
          setValue(data.uid); // Auto-fill the input
          onScan(data.uid);   // Notify parent component
        }
      } catch (err) {
        console.error("Failed to fetch UID:", err);
      }
    }, 300);

    // Cleanup the interval when polling should stop
    return () => clearInterval(interval);
  }, [value, onScan, stopPolling, disabled]);

  // 🔹 Manual entry via keyboard
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: value.trim() }),
        });

        const result = await response.json();

        if (response.ok) {
          onScan(value.trim());
          setValue(""); // Reset input after scan
        } else {
          setError(result.error || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to register UID");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Scan or type RFID tag"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
