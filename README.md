![Status](https://img.shields.io/badge/WORKING-green) ![Primary OS](https://img.shields.io/badge/Primary_OS-Ubuntu-orange?logo=ubuntu&logoColor=white) [![version](https://img.shields.io/github/v/tag/Th3C0d3Mast3r/rfid-inventory-management?label=version&sort=semver)](https://github.com/Th3C0d3Mast3r/rfid-inventory-management/tags) ![License](https://img.shields.io/github/license/Th3C0d3Mast3r/rfid-inventory-management?label=License&color=blue) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

![main image of readme](./images/readmeMainImage.png)

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
The base tech-stack used here is:-
- **FRONTEND:** Next.js
- **BACKEND:** Express + Node
- **DATABASE:** MongoDB 
- **MISCELLANEOUS:** Shell and Python


## Internal Hardware Configuration [RFID Version]
The below is the connection that is done on the ESP32 Espressif Board, connected to **RFID RC522** Reader
![image of hardware connection](./images/Hardware%20Configuration.png)

---

## Features
- **Scan RFID Tags**: Add or remove items with RFID scanning
- **Inventory Dashboard**: View total items, quantities, and grouped inventory
- **Admin Controls**: Manage staff and monitor quick stats
- **Action Modals**: Confirm stock addition or removal before updating the database
- **IoT Integration**: Send RFID data directly from devices to the system

---

## Getting Started
The following repository is sufficient to setup an RFID based inventory management system for a small scale to a medium scale company/org. 

### SYSTEM SPECIFICATIONS [base requirements]
To run the whole thing perfectly, the below are the base requirements:-
 
-  **DISK:** 1.5 GB minimum | 3–4 GB recommended
- **RAM:** 2 GB minimum | 4 GB recommended | 8 GB ideal
- **CPU:** Dual-core minimum | Quad-core recommended
- **Wi-Fi:** An in-org Wi-Fi is needed using which, the wireless scanning can be done *(with admin access to MAC bind some IP pairs)*
 
Apart from this, the following diagram should be enough to understand what to do when, and what to do after that. Thus, refer the below diagram to understand the setup flow.
![image for overall system setup steps](./images/setupProcess.png)

### CODE SNIPPETS [to make the setup]
1. If you have base OS of `ubuntu` - a linux distribution, then its good *(as have written a config file for Ubuntu only)* - for windows, its you who has to do all the things manually by searching online *(will provide the resources, dw)*.
```bash
# Clone the repository on your device
git clone "https://github.com/Th3C0d3Mast3r/rfid-inventory-management.git"

#  Once cloned, head into the repo
cd rfid-inventory-management
./baseConfig.sh

# NOTE:- If mongoDB doesn't work on Ubuntu, use docker based things

# if docker not installed, then run this
sudo apt install docker.io

# if already installed, do:-
sudo apt run mongo  # will auto-pull an image [try mongo or mongod-test by search first]
```
2.  With having done the above steps, your device is now ready to start the `backend` and `frontend` server. But before that, download all the dependencies
```bash
cd frontend/frontend
npm i

# now, head to backend directory by doing
cd ..
cd ..
cd backend
npm i
```
> ⚠ **NOTE:** when `npm i` doesnt work, then, try this:- `npm i --force`
3.  After this, ensure, your `.env` is well present, and written well. Your `backend/.env` should have:-
- PORT=7500 
- MONGODB_URI=mongodb://admin:secret@localhost:27017/rfid?authSource=admin
- JWT_SECRET=\<yourSecret>
> **NOTE:** The above mongoDB URI is for docker based mongo running. If you are on windows, add a uri to your localhost machine-and if the db is cloud based, add that URI here. **DO NOT CHANGE THE PORT THO!**

Once all this is there, then head on to run the backend and frontend server.
```bash
# start the frontend and backend server:-
npx nodemon server.js    # inside backend directory
npm run dev              # inside frontend directory

# OR

# type this in the root dir - not in the sub-directory [NOT CONSIDERED GOOD THO]
./startApp.sh
```
4.  Once the `backend` and `frontend` start to run, head on to the web-UI presented, connect the Scanner-and start the monitoring!
> **DO NOT FLASH THE SCANNER DEVICE WITH ANY OTHER CODE. IF DONE, YOU WILL NEED TO MANUALLY BURN THE CODE AGAIN INTO THAT.**

>In case this happens, then, use the code present in `main.py` and using `thonny` or any other software that allows to burn code into ESP32-Espressif, burn that code into the scanner device *(keep in mind, while self burning, you should keep in mind the SSID and PASSWORD of your organization, along with the device where your interface is there)*

## Future Enhancements
- [ ] User activity logs for inventory changes
- [ ] Compatible code for Barcode Scanner and other Mediums (wirelessly)
- [ ] IoT device authentication for secure communication
- [ ] OTP based authentication of Users

## Version History

| Version | Date       | Author | Description / Changes Made                                          | Status      |
|----------|------------|--------|---------------------------------------------------------------------|--------------|
| 1.0.0      | 25th October, 2025 | @Th3C0d3Mast3r | Base Frontend-Backend with Database Connectivity  | `Completed` |
| 1.0.1      | 15th November, 2025 | @Th3C0d3Mast3r | Proper RFID Scan based Inventory Management w/ Manual Override | `Completed` |

## Contributing
Well, contrbutions are welcome-make a PR, and if the suggested PR works well, and can be included in the coming Versions, will be included, and credits be given in the version history   ;)

---

> 👨‍💻 Built with 💖 by **[@Th3C0d3Mast3r](https://th3c0d3mast3r.github.io/portfolioWebsite/)**

