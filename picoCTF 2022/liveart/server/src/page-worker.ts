import puppeteer from "puppeteer";
import * as fs from "fs/promises";
import * as path from "path";

import { dequeue } from "./database.js";

// Hardcoded b/c no way to get it from the pico platform.
const ORIGIN = "http://localhost:4000";

const bongoCat = (await fs.readFile(path.resolve("./bongo-cat.json"))).toString("utf8");
const defaultMetadata = Buffer.from(JSON.stringify({ flag: "picoCTF{copilot_says_bongo_cat_is_awesome" }), "utf-8");
const metadata = await fs.readFile("/challenge/metadata.json").catch(() => defaultMetadata);
const flag = JSON.parse(metadata.toString("utf-8")).flag as string


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const visitOne = async () => {
    const url = await dequeue();
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

    await page.goto(ORIGIN);
    await page.evaluate(([bongoCat, flag]) => {
        localStorage.setItem("image", bongoCat);
        localStorage.setItem("username", JSON.stringify(flag));
    }, [bongoCat, flag]);

    await page.close();
    const secondPage = await browser.newPage();

    await Promise.race([
        secondPage.goto(url),
        sleep(3000),
    ]);
    await sleep(3000);

    await browser.close();
}

export const startVisiting = async () => {
    while (true) {
        try {
            await visitOne();
        } catch (e) {
            console.error(e);
        }
    }
}

