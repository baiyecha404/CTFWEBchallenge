"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startVisiting = void 0;
const puppeteer = require("puppeteer");
const database_1 = require("./database");
const flag = process.env.FLAG ?? "flag{missing}";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const visitOne = async () => {
    const url = await (0, database_1.dequeue)();
    if (url === undefined) {
        await sleep(500);
        return;
    }
    const browser = await puppeteer.launch({
        dumpio: true,
        pipe: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setCookie({
        name: "flag",
        value: flag,
        domain: "localhost:3838",
    });
    await Promise.race([
        page.goto(url),
        sleep(3000),
    ]);
    await sleep(3000);
    await browser.close();
};
const startVisiting = async () => {
    while (true) {
        try {
            await visitOne();
        }
        catch (e) {
            console.error(e);
        }
    }
};
exports.startVisiting = startVisiting;
//# sourceMappingURL=page-worker.js.map