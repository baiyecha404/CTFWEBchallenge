#!/bin/bash
while true
do
	if curl -s "localhost:8080/alive.txt" | grep -q "I'm alive!"; then
		echo "UP" >/dev/null
	else
		echo "Down, restarting..."
		pkill -u www-data -SIGKILL
	fi
	sleep 30
done
