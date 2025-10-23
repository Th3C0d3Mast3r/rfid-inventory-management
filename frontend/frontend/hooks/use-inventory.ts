// frontend/hooks/use-inventory.ts
import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/context/auth-context"

// ✅ Define inventory item type
export interface InventoryItem {
  _id?: string
  rfid: string
  name: string
  quantity?: number
  scannedAt?: string
  employee?: string
}

export function useInventory() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>([]) // ✅ typed array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
  if (authLoading) return // wait until auth ready
  setLoading(true)
  try {
    const res = await fetch("/api/inventory/items")
    const data: any[] = await res.json() // keep as any to flatten

    // ✅ Flatten itemIDs for frontend
    const flattened: InventoryItem[] = data.flatMap(inv =>
      inv.itemIDs.map((id: any) => ({
        rfid: id.itemId,
        name: inv.itemName,
        quantity: id.quantity ?? 1, // default to 1 if quantity missing
        scannedAt: id.assignedAt,
        employee: id.employee,
        _id: id._id,
      }))
    )

    setItems(flattened)
  } catch (err) {
    console.error("Error fetching items:", err)
    setError("Failed to load inventory")
  } finally {
    setLoading(false)
  }
}, [authLoading])

  // Add item to DB
  const addItem = useCallback(
  async (itemName: string, itemId: string, emailId: string) => {
    if (authLoading) {
      console.log("Auth still loading...");
      return;
    }

    if (!emailId) {
      console.error("Cannot add item: emailId missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, itemId, emailId }),
      });

      const data: InventoryItem = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Failed to add item");

      console.log("Item added:", data);
      await fetchItems();
    } catch (err: any) {
      console.error("Error adding item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },
  [authLoading, fetchItems]
);


  // Update item
  const updateItem = useCallback(
    async (itemId: string, updates: Partial<InventoryItem>) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/inventory/items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        if (!res.ok) throw new Error("Failed to update item")
        await fetchItems()
      } catch (err: any) {
        console.error("Error updating item:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [fetchItems]
  )

  // Delete item
  const deleteItem = useCallback(
    async (itemId: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/inventory/items/${itemId}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete item")
        await fetchItems()
      } catch (err: any) {
        console.error("Error deleting item:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [fetchItems]
  )

  useEffect(() => {
    if (!authLoading) fetchItems()
  }, [authLoading, fetchItems])

  return { items, loading, error, addItem, updateItem, deleteItem, fetchItems }
}
