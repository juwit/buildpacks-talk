#!/bin/sh

sudo cp 99-streamdeck.rules /etc/udev/rules.d/99-streamdeck.rules

sudo chown root:root /etc/udev/rules.d/99-streamdeck.rules

sudo udevadm control --reload-rules
