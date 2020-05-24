#!/bin/bash

set -m
/usr/bin/python3 /var/SuperSecureServer/main.py &
while true; do fg; sleep 1; done
