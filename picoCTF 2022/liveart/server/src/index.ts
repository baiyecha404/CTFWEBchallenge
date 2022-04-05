import express from "express";
import bodyParser from "body-parser";
import * as path from "path";
import { enqueue } from "./database.js";
import { startVisiting } from "./page-worker.js";

const app = express();

app.use(bodyParser.json());

app.post("/fan-mail", async (req, res) => {
    const { url } = req.body;
    const ip = req.ip;

    if (typeof url !== "string") {
        return res.status(500).send("URL must be a string");
    }

    const asUrl = new URL(url);
    if (asUrl.protocol !== "http:" && asUrl.protocol !== "https:") {
        return res.status(500).send("URL must be http or https");
    }

    const success = await enqueue(url, ip);

    if (success === false) {
        return res.status(420).send("You already have 3 requests in the queue");
    }

    return res.status(200).send(`Your request is number ${success} in the queue`);
});

app.use("/", express.static(path.resolve("../client/dist")));
app.use("/", (req, res) => {
    res.sendFile(path.resolve("../client/dist/index.html"));
});

startVisiting();
app.listen(4000);

process.on("unhandledRejection", (error) => {
    throw error;
})