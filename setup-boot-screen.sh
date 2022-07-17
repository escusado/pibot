#!/bin/bash

set -e

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

cp ./oled-boot-screen.service /etc/systemd/system/
systemctl enable oled-boot-screen