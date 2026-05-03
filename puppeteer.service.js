const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

let browser;
const queue = [];
let running = 0;
const MAX = 2;

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: await chromium.executablePath(),
            args: [
                ...chromium.args,
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ],
            headless: true
        });

        browser.on("disconnected", () => {
            browser = null;
        });
    }
    return browser;
}

function runPuppeteerTask(task) {
    return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        processQueue();
    });
}

async function processQueue() {
    if (running >= MAX || queue.length === 0) return;

    const { task, resolve, reject } = queue.shift();
    running++;

    try {
        const browser = await getBrowser();
        const page = await browser.newPage();

        const result = await task(page);

        await page.close();
        resolve(result);
    } catch (err) {
        reject(err);
    }

    running--;
    processQueue();
}

module.exports = { runPuppeteerTask };