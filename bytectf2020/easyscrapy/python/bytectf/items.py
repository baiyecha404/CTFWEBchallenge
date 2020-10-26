# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BytectfItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    byte_start = scrapy.Field()
    byte_url = scrapy.Field()
    byte_text = scrapy.Field()
