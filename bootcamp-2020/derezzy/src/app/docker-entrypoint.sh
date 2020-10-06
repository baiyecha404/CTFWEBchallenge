#!/usr/bin/env bash

# Wait for PostgreSQL
/usr/local/bin/wait-for-it.sh psql:5432 -s -q

if [ $? -eq 0 ]; then
	cd /var/www

	# Check if we are executing tests
	if [ "$1" = "test" ]; then
		lapis migrate $1 --trace
		#@busted --trace

	# Run Application normally
	else
        nohup python3 serve.py < /dev/null &
		lapis migrate --trace
		lapis server $1 --trace
	fi

else
	exit 5432 # PostgreSQL didn't load
fi
