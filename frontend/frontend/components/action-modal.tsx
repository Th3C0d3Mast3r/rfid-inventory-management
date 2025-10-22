"use client"

interface ActionModalProps {
  rfid: string
  itemName: string
  onStockTake: () => void
  onStockClear: () => void
  onClose: () => void
  loading?: boolean
}

export function ActionModal({ rfid, itemName, onStockTake, onStockClear, onClose, loading }: ActionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-sm w-full p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Item Scanned</h2>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">{itemName}</span> (RFID: {rfid})
        </p>

        <div className="space-y-3">
          <button
            onClick={onStockTake}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Stock Take (+1)
          </button>
          <button
            onClick={onStockClear}
            disabled={loading}
            className="w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Stock Clear (-1)
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full px-4 py-3 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
