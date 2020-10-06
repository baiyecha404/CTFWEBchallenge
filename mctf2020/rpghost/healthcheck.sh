#!/bin/sh
result=$(curl --request GET -sL --url 'http://localhost:3456/healthcheck')
echo "$result"
if [ "$result" = "ok" ]; then
    exit 0
else
    exit 1
fi