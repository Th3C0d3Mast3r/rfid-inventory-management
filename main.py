# the following code is for the ESP32.
# Have a proper connection with Internet (I would say, never CHANGE THE WiFi)
# Also, have a static IP for the machine that will be scanning this. So, you do not have to change the IPs inside over and over

# with these things done, the ESP can be directly run! WITHOUT having to open THONNY and making any changes

import network
import urequests
import ujson
import time
from machine import Pin, SPI
from mfrc522 import MFRC522
import gc

# --- Wi-Fi Setup ---
SSID = "Redmi"
PASSWORD = "chachaMusic"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print("Connecting to Wi-Fi...")
    wlan.connect(SSID, PASSWORD)
    while not wlan.isconnected():
        time.sleep(0.5)
print("Connected! IP:", wlan.ifconfig()[0])

# --- SPI & RFID Setup ---
sck = 18
mosi = 23
miso = 19
cs = 21

spi = SPI(2, baudrate=1000000, polarity=0, phase=0,
          sck=Pin(sck), mosi=Pin(mosi), miso=Pin(miso))
rdr = MFRC522(spi, Pin(cs))

# --- Frontend API URL ---
FRONTEND_SCAN_URL = "http://192.168.43.127:3000/api/scan"

print("\nBring RFID Tag closer...")

last_uid = None
tag_present = False  # tracks if a tag is currently in range

while True:
    try:
        stat, tag_type = rdr.request(rdr.REQIDL)

        if stat == rdr.OK:
            stat, uid = rdr.anticoll()
            if stat == rdr.OK and uid:
                uid_str = "{:02x}{:02x}{:02x}{:02x}".format(uid[0], uid[1], uid[2], uid[3])

                # Detect new tag or a re-scan after removal
                if not tag_present or uid_str != last_uid:
                    print("Tag Detected! UID:", uid_str)
                    try:
                        data = ujson.dumps({"uid": uid_str})
                        headers = {"Content-Type": "application/json"}

                        response = urequests.post(FRONTEND_SCAN_URL, data=data, headers=headers)

                        if response.status_code == 200:
                            print("UID sent successfully!")
                            last_uid = uid_str
                            tag_present = True
                        else:
                            print("Frontend did not confirm success:", response.status_code)

                        response.close()
                        del response
                        gc.collect()

                    except Exception as e:
                        print("Error sending UID:", e)

        else:
            # No tag detected now → mark as removed
            if tag_present:
                print("Tag removed")
                tag_present = False
                last_uid = None

        time.sleep(0.2)

    except Exception as e:
        print("Main loop error:", e)
        time.sleep(1)