import asyncio
from pyppeteer import launch
from redis import Redis
from rq import Queue
import os
import psutil, signal


async def main(url):
    browser = await launch(headless=True,
                           executablePath="/usr/bin/chromium-browser",
                           args=['--no-sandbox', '--disable-gpu'])
    try:
        page = await browser.newPage()
        await page.goto("https://notes.web.byteband.it/login")
        await page.type("input[name='username']", "admin")
        await page.type("input[name='password']", os.environ.get("ADMIN_PASS"))
        await asyncio.wait([
            page.click('button'),
            page.waitForNavigation(),
        ])

        newPage = await browser.newPage()
        await newPage.goto(url)
    except Exception as e:
        raise e
    finally:
        await browser.close()


def visit_url(url):
    asyncio.get_event_loop().run_until_complete(main(url))

q = Queue(connection=Redis(host='redis'))
