#!/usr/bin/env bash

BOLD="\e[1m"
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
BLUE="\e[34m"
R="\e[0m"

# making some helper functions (wow, this is something new-did not know this!)
msg(){
    echo -e "${BOLD}${BLUE}[*]${R}$1"
}

success(){
    echo -e "${BOLD}${GREEN}[✔]${R}${GREEN}$1${R}"
}

fail(){
    echo -e "${BOLD}${RED}[✘]${R}$1"
    exit 1
}

warn(){
    echo -e "${BOLD}${YELLOW}[!]${R}$1"
}

info(){
    echo -e "${BOLD}${BLUE}[*]${R}$1"
}

# now we start with the things that I wanna run!

msg "Checking OPERATING SYSTEM..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ "$ID" != "ubuntu" ]]; then
        fail "This system is NOT Ubuntu (detected: $NAME). Exiting."
    fi
else
    fail "/etc/os-release not found. Cannot verify OS type."
fi

success "Ubuntu detected: $PRETTY_NAME"

msg "Updating packages"
sudo apt update

msg "Checking for Python presence"
if command -v python >/dev/null 2>&1; then
    success "Python LTS found: $(python --version)"
else
    warn "'python' command missing. Installing Ubuntu's LTS Python..."
    sudo apt-get install -y python-is-python3 python3 || fail "Failed to install Python LTS."

    if command -v python >/dev/null 2>&1; then
        success "Python LTS installed successfully: $(python --version)"
    else
        fail "'python' command still not available after install."
    fi
fi

msg "Checking for pip / pip3 presence..."
if command -v pip3 >/dev/null 2>&1; then
    success "pip3 found: $(pip3 --version)"
else
    warn "'pip3' command missing. Installing pip3 for Python LTS..."
    sudo apt-get install -y python3-pip || fail "Failed to install pip3."
    success "pip3 installed: $(pip3 --version)"
fi

if command -v pip >/dev/null 2>&1; then
    success "'pip' command already available: $(pip --version)"
else
    warn "'pip' not found. Creating symlink to pip3..."
    sudo ln -s /usr/bin/pip3 /usr/bin/pip || fail "Failed to create pip symlink."
    success "'pip' command created and ready to use: $(pip --version)"
fi

# DATABASE CHECKING
msg "Database checking in progress - checking for inherent database presence..."

if command -v mongod >/dev/null 2>&1; then
    success "MONGODB FOUND : $(mongod --version | head -n 1)"
else
    warn "MONGODB NOT FOUND. Attempting to install Ubuntu's MongoDB package..."
    warn "If you plan to connect to cloud-hosted MongoDB, set that URI in your ENV instead."

    # Non-fatal install
    if ! sudo apt-get install -y mongodb; then
        warn "MongoDB installation failed — skipping MongoDB setup and continuing."
        MONGO_FAIL=true
    fi

    # Validate only if it installed successfully
    if [ -z "$MONGO_FAIL" ] && command -v mongod >/dev/null 2>&1; then
        success "MongoDB installed successfully: $(mongod --version | head -n 1)"
        msg "MongoDB service status:"
        systemctl status mongodb --no-pager
    fi
fi

msg "Completeing the base configuration script"
sudo ufw allow 3000/tcp

echo "====================================================="
success "BASE CONFIG COMPLETED"
echo "====================================================="

info "Refer the MARKDOWN and see the DIAGRAM to know what next to do!"
msg "Thank you! Th3C0d3Mast3r signing out."
