# RFID INVENTORY MANAGEMENT SYSTEM

## Introduction
This project is a **real-time inventory management system** designed to integrate with IoT devices for RFID scanning.  
It allows employees to **scan, add, and remove inventory items** from a centralized database, with real-time updates displayed on the dashboard.  

Key features:
- Real-time scanning and inventory tracking
- Grouped inventory display by item name
- Add and remove items using RFID tags
- Role-based access (Admin & Staff)
- Seamless IoT device integration via API/WebSocket

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, MongoDB (for database) |
| Authentication | Custom JWT-based auth with context (`auth-context`) |
| Real-time | WebSocket / REST API (IoT device integration) |
| State Management | React hooks (`useInventory`, `useAuth`) |

---

## Features
- **Scan RFID Tags**: Add or remove items with RFID scanning
- **Inventory Dashboard**: View total items, quantities, and grouped inventory
- **Admin Controls**: Manage staff and monitor quick stats
- **Action Modals**: Confirm stock addition or removal before updating the database
- **IoT Integration**: Send RFID data directly from devices to the system

---

## Getting Started
1) Clone the repository, make the `.env` file where you add[PORT=7500, MONGODB_URI, JWT_SECRET]:-
```bash
git clone "https://github.com/Th3C0d3Mast3r/rfid-inventory-management.git"

cd backend
touch .env
```

2) Once done-run the backend using `npx nodemon server.js` and then, run the frontend using `npm run dev`

## Future Enhancements
- User activity logs for inventory changes
- QR code scanning integration
- IoT device authentication for secure communication
- OTP based authentication