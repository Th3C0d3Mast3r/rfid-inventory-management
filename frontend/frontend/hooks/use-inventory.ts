"use client"

import { useState, useCallback } from "react"
import type { InventoryItem } from "@/types/inventory"

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/inventory/items")
      if (!response.ok) throw new Error("Failed to fetch items")
      const data = await response.json()
      setItems(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const addItem = useCallback(async (rfid: string, name: string) => {
    try {
      const response = await fetch("/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid, name, quantity: 1 }),
      })
      if (!response.ok) throw new Error("Failed to add item")
      const data = await response.json()
      setItems((prev) => [...prev, data.item])
      return data.item
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    }
  }, [])

  const updateItem = useCallback(async (rfid: string, updates: Partial<InventoryItem>) => {
    try {
      const response = await fetch(`/api/inventory/items/${rfid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update item")
      const data = await response.json()
      setItems((prev) => prev.map((item) => (item.rfid === rfid ? data.item : item)))
      return data.item
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    }
  }, [])

  const deleteItem = useCallback(async (rfid: string) => {
    try {
      const response = await fetch(`/api/inventory/items/${rfid}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete item")
      setItems((prev) => prev.filter((item) => item.rfid !== rfid))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    }
  }, [])

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  }
}
