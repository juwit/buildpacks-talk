#!/usr/bin/env bash

echo "Show Window"

WINDOW_CLASS=$1

# get window id from class name
WINDOW_ID=$(wmctrl -l -x | grep $WINDOW_CLASS | cut -d ' ' -f 1)

# show window at front
#wmctrl -i -r $WINDOW_ID -b toggle,above
# activate the window
wmctrl -i -a $WINDOW_ID
