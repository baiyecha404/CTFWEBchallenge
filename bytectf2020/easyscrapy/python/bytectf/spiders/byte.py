import scrapy
import re
import base64
from scrapy_redis.spiders import RedisSpider
from bytectf.items import BytectfItem

class ByteSpider(RedisSpider):
    name = 'byte'

    def parse(self, response):
        byte_item = BytectfItem()
        byte_item['byte_start'] = response.request.url
        url_list = []
        test = response.xpath('//a/@href').getall()
        for i in test:
            if i[0] == '/':
                url = response.request.url + i
            else:
                url = i
            if re.search(r'://',url):
                r = scrapy.Request(url,callback=self.parse2,dont_filter=True)
                r.meta['item'] = byte_item
                yield r
            url_list.append(url)
            if(len(url_list)>3):
                break
        byte_item['byte_url'] = response.request.url
        byte_item['byte_text'] = base64.b64encode((response.text).encode('utf-8'))
        yield byte_item

    def parse2(self,response):
        item = response.meta['item']
        item['byte_url'] = response.request.url
        item['byte_text'] = base64.b64encode((response.text).encode('utf-8'))
        yield item
