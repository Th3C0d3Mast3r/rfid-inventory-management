"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import { Header } from "@/components/header";
import { ScanInput } from "@/components/scan-input";
import { ItemModal } from "@/components/item-modal";
import { ActionModal } from "@/components/action-modal";
import { InventoryTable } from "@/components/inventory-table";
import AdminStaffTable from "@/components/adminStaffTable";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, loading, fetchItems, addItem, updateItem, deleteItem } = useInventory();

  const [scannedRfid, setScannedRfid] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ rfid: string; name: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  const handleScan = (rfid: string) => {
    const existingItem = items.find((item) => item.rfid === rfid);

    if (existingItem) {
      setSelectedItem({ rfid: existingItem.rfid, name: existingItem.name });
      setIsActionModalOpen(true);
    } else {
      setScannedRfid(rfid);
      setIsItemModalOpen(true);
    }
  };

  const handleAddItem = async (name: string) => {
    if (scannedRfid) {
      await addItem(scannedRfid, name);
      setIsItemModalOpen(false);
      setScannedRfid(null);
    }
  };

  const handleStockTake = () => {
    if (selectedItem) {
      const item = items.find((i) => i.rfid === selectedItem.rfid);
      if (item) {
        updateItem(selectedItem.rfid, { quantity: item.quantity + 1 });
      }
      setIsActionModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleStockClear = () => {
    if (selectedItem) {
      const item = items.find((i) => i.rfid === selectedItem.rfid);
      if (item && item.quantity > 0) {
        updateItem(selectedItem.rfid, { quantity: item.quantity - 1 });
      }
      setIsActionModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleIncrement = (rfid: string) => {
    const item = items.find((i) => i.rfid === rfid);
    if (item) {
      updateItem(rfid, { quantity: item.quantity + 1 });
    }
  };

  const handleDecrement = (rfid: string) => {
    const item = items.find((i) => i.rfid === rfid);
    if (item && item.quantity > 0) {
      updateItem(rfid, { quantity: item.quantity - 1 });
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
          {/* Scan Section */}
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
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Staff Table */}
              {user?.role === "ADMIN" && <AdminStaffTable user={{
                id: user._id,
                name: user.name,
                emailId: user.emailId,
                role: user.role
              }} />}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Inventory</h2>
              <InventoryTable
                items={items}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onDelete={deleteItem}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Item Modal */}
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

      {/* Action Modal */}
      {isActionModalOpen && selectedItem && (
        <ActionModal
          rfid={selectedItem.rfid}
          itemName={selectedItem.name}
          onStockTake={handleStockTake}
          onStockClear={handleStockClear}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedItem(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
