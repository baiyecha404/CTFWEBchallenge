#!/usr/bin/env python
# -*- coding:utf-8 -*-

import redis

redis_Host = "127.0.0.1"
redis_key = 'byte:start_urls'
for i in range(1,200):
    rediscli = redis.Redis(host = redis_Host, port = 6379, db = "0")
    rediscli.lpush(redis_key, "http://www.baidu.com")
