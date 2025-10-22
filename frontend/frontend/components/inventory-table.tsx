"use client"

import type { InventoryItem } from "@/types/inventory"
import { Trash2, Plus, Minus } from "lucide-react"

interface InventoryTableProps {
  items: InventoryItem[]
  onIncrement: (rfid: string) => void
  onDecrement: (rfid: string) => void
  onDelete: (rfid: string) => void
  loading?: boolean
}

export function InventoryTable({ items, onIncrement, onDecrement, onDelete, loading }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No items in inventory yet</p>
        <p className="text-sm text-muted-foreground mt-1">Scan an item to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">RFID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantity</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.rfid} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-foreground">{item.rfid}</td>
              <td className="px-4 py-3 text-sm text-foreground">{item.name}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onDecrement(item.rfid)}
                    disabled={loading || item.quantity <= 0}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => onIncrement(item.rfid)}
                    disabled={loading}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(item.rfid)}
                  disabled={loading}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive disabled:opacity-50 transition-colors"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
