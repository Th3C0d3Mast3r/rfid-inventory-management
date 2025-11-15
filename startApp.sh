#!/usr/bin/env bash

BOLD="\e[1m"
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
BLUE="\e[34m"
R="\e[0m"

msg(){ echo -e "${BOLD}${BLUE}[*]${R} $1"; }
success(){ echo -e "${BOLD}${GREEN}[✔]${R} $1"; }
warn(){ echo -e "${BOLD}${YELLOW}[!]${R} $1"; }
fail(){ echo -e "${BOLD}${RED}[✘]${R} $1"; exit 1; }

# SAFETY CHECK (Y/N) - If user passed -y → skip asking
if [[ "$1" != "-y" ]]; then
    warn "THIS IS NOT A GOOD PRACTICE THOUGH. RUNNING FRONTEND + BACKEND DIRECTLY CAN BE UNSTABLE."
    read -p "IF YOU STILL WANT TO CONTINUE, PRESS [y/n]: " choice

    case "$choice" in
        y|Y)
            msg "Proceeding..."
            ;;
        n|N)
            fail "User chose to cancel. Exiting safely."
            ;;
        *)
            fail "Invalid option. Please run again and press y/n."
            ;;
    esac
else
    msg "Auto-continue enabled via -y flag."
fi

# START BACKEND
msg "Starting BACKEND"
cd backend || fail "Backend folder not found."

npx nodemon server.js &
BACKEND_PID=$!

sleep 3  # wait for backend to boot

if ps -p $BACKEND_PID >/dev/null 2>&1; then
    success "Backend is running (PID: $BACKEND_PID)"
else
    fail "Backend failed to start."
fi

# START FRONTEND
msg "Starting FRONTEND"
cd ../frontend/frontend || fail "Frontend folder not found."

npm run dev &
FRONTEND_PID=$!

sleep 2

if ps -p $FRONTEND_PID >/dev/null 2>&1; then
    success "Frontend is running (PID: $FRONTEND_PID)"
else
    warn "Frontend failed to start."
fi

msg "Both systems started successfully!"
echo -e "${YELLOW}Backend PID:${R} $BACKEND_PID"
echo -e "${YELLOW}Frontend PID:${R} $FRONTEND_PID"
echo ""
success "${GREEN}SYSTEM FULLY RUNNING!${R}"

info "To Access the Frontend, open your browser and go to:"
echo -e "${YELLOW}http://localhost:3000${R}"

echo "====================================================="
info "To stop the systems, use the following command:"
echo -e "${RED}IN CASE YOU DO SOME PROBLEM — JUST TYPE THIS:${R}"
echo -e "${YELLOW}pkill -f 'node'${R}"
info "THIS WILL KILL ALL NODE PROCESSES RUNNING ON YOUR MACHINE."
echo "====================================================="
