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


## Hardware Configuration
The below is the connection that is done on the ESP32 Espressif Board, connected to RFID RC522 Reader
![image of hardware connection](./images/Hardware%20Configuration.png)

And, for the code, used in the ESP32-check out:-
https://pastebin.com/aGmHFaph

---

## Features
- **Scan RFID Tags**: Add or remove items with RFID scanning
- **Inventory Dashboard**: View total items, quantities, and grouped inventory
- **Admin Controls**: Manage staff and monitor quick stats
- **Action Modals**: Confirm stock addition or removal before updating the database
- **IoT Integration**: Send RFID data directly from devices to the system

---

## Getting Started
1) Clone the repository, make the `.env`:-
```bash
git clone "https://github.com/Th3C0d3Mast3r/rfid-inventory-management.git"

cd backend
touch .env     # add these there:- PORT=7500, MONGODB_URI, JWT_SECRET

# in backend, as well as in the frontend, do:-
npm i
```

2) Once done-run
- **BACKEND** → `npx nodemon server.js`
- **FRONTEND** → `npm run dev`

## Future Enhancements
- User activity logs for inventory changes
- QR code scanning integration
- IoT device authentication for secure communication
- OTP based authentication

## Version History

| Version | Date       | Author | Description / Changes Made                                          | Status      |
|----------|------------|--------|---------------------------------------------------------------------|--------------|
| 1.0.0      | 25th October, 2025 | @Th3C0d3Mast3r | Base Frontend-Backend with Database Connectivity  | `Completed` |
| 1.0.1      | TBA | @Th3C0d3Mast3r | Proper RFID Scan based Inventory Management w/ Manual Override | `In-Progress` |

## Contibuting
Well, contrbutions are welcome-make a PR, and if the suggested PR works well, and can be included in the coming Versions, will be included, and credits be given in the version history   ;)

**CURRENT CONTRIBUTORS**: @Th3C0d3Mast3r
