BOT_NAME = 'bytectf'
SPIDER_MODULES = ['bytectf.spiders']
NEWSPIDER_MODULE = 'bytectf.spiders'
RETRY_ENABLED = False
ROBOTSTXT_OBEY = False
DOWNLOAD_TIMEOUT = 8
USER_AGENT = 'scrapy_redis'
SCHEDULER = "scrapy_redis.scheduler.Scheduler"
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"
REDIS_HOST = '172.18.0.3'
REDIS_PORT = 6379
ITEM_PIPELINES = {
 'bytectf.pipelines.BytectfPipeline': 300,
}
