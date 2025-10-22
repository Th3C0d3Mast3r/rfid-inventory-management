export interface InventoryItem {
  rfid: string // Changed from 'id' to 'rfid' - unique identifier for each scanned item
  name: string
  quantity: number
  scannedAt: string
}

export interface ScanResult {
  rfid: string
  timestamp: string
}

export interface Employee {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  role: string
  createdAt: string
}
