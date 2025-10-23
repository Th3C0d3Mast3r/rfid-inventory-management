"use client"

import type { InventoryItem } from "@/hooks/use-inventory"

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

  // Group items by item name
  const groupedItems = items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    if (!acc[item.name]) acc[item.name] = []
    acc[item.name].push(item)
    return acc
  }, {})

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Item Name</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantity</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Last Scanned</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">IDs</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedItems).map(([name, group]) => {
            const totalQuantity = group.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
            const lastScanned = group.reduce((latest, item) => {
              const scanned = item.scannedAt ? new Date(item.scannedAt) : new Date(0)
              return scanned > latest ? scanned : latest
            }, new Date(0))

            return (
              <tr key={name} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-foreground">{name}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-8 text-center font-semibold text-foreground">{totalQuantity}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-foreground">
                  {lastScanned.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {group.map(item => (
                      <button
                        key={item.rfid}
                        onClick={() => {
                          const confirmDelete = window.confirm(`Do you wish to REMOVE itemId ${item.rfid}?`)
                          if (confirmDelete) onDelete(item.rfid)
                        }}
                        className="px-2 py-1 bg-muted/30 rounded text-sm font-mono hover:bg-destructive/20 transition-colors"
                        disabled={loading}
                      >
                        {item.rfid}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
