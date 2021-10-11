#!/bin/bash

export SECRET_KEY_BASE=`head -c 16 /dev/urandom | xxd -ps`
service postfix start
su app - -c 'bundle exec rails server --environment=production'