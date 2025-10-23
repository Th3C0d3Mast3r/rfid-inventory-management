"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import { Header } from "@/components/header";
import { ScanInput } from "@/components/scan-input";
import { ItemModal } from "@/components/item-modal";
// import { ActionModal } from "@/components/action-modal"; // NOT NEEDED ANYMORE
import { InventoryTable } from "@/components/inventory-table";
import AdminStaffTable from "@/components/adminStaffTable";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, loading, fetchItems, addItem, updateItem, deleteItem } = useInventory();

  const [scannedRfid, setScannedRfid] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  // const [isActionModalOpen, setIsActionModalOpen] = useState(false); // NOT NEEDED
  // const [selectedItem, setSelectedItem] = useState<{ rfid: string; name: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/"); // redirect if not logged in
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

  // SCAN HANDLER
  const handleScan = (rfid: string) => {
    const existingItem = items.find((item) => item.rfid === rfid);

    if (existingItem) {
      // ASK CONFIRMATION TO DELETE
      const confirmDelete = window.confirm(`Do you wish to REMOVE itemId ${rfid}?`);
      if (confirmDelete) {
        deleteItem(rfid); // DELETE FROM DB
      }
    } else {
      setScannedRfid(rfid);
      setIsItemModalOpen(true); // ADD FLOW
    }
  };

  // ADD ITEM
  const handleAddItem = async (name: string) => {
    if (!scannedRfid) return console.error("Cannot add item: scannedRfid missing");
    if (!user?.emailId) return console.error("Cannot add item: user email not loaded yet");

    const itemName = name;
    const itemId = scannedRfid;
    const emailId = user.emailId; // pass emailId to hook

    try {
      await addItem(itemName, itemId, emailId); // Uses existing hook
    } catch (err) {
      console.error("Add Item Failed:", err);
    } finally {
      setIsItemModalOpen(false);
      setScannedRfid(null);
    }
  };

  // INCREMENT / DECREMENT QUANTITY (optional)
  const handleIncrement = async (rfid: string) => {
    const item = items.find((i) => i.rfid === rfid);
    if (item) {
      const newQty = (item.quantity ?? 0) + 1;
      await updateItem(rfid, { quantity: newQty });
    }
  };

  const handleDecrement = async (rfid: string) => {
    const item = items.find((i) => i.rfid === rfid);
    if (item && (item.quantity ?? 0) > 0) {
      const newQty = Math.max(0, (item.quantity ?? 0) - 1);
      await updateItem(rfid, { quantity: newQty });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SCANNER SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Scanner</h2>
              <ScanInput onScan={handleScan} disabled={loading} />

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">Quick Stats</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Total Items</span>
                    <span className="font-semibold text-foreground">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Total Quantity</span>
                    <span className="font-semibold text-foreground">
                      {items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {user?.role === "ADMIN" && (
                <AdminStaffTable
                  user={{
                    id: user._id,
                    name: user.name,
                    emailId: user.emailId,
                    role: user.role,
                  }}
                />
              )}
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Inventory</h2>
              <InventoryTable
                items={items.map((item) => ({
                  rfid: item.rfid,
                  name: item.name,
                  quantity: item.quantity ?? 0,
                  scannedAt: item.scannedAt ? new Date(item.scannedAt).toISOString() : new Date().toISOString(),
                }))}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onDelete={deleteItem} // still used for programmatic deletion
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      {isItemModalOpen && scannedRfid && (
        <ItemModal
          rfid={scannedRfid}
          onSubmit={handleAddItem}
          onClose={() => {
            setIsItemModalOpen(false);
            setScannedRfid(null);
          }}
          loading={loading}
        />
      )}

      {/* ActionModal NOT NEEDED ANYMORE */}
    </div>
  );
}
