const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

/* =========================
   BROWSER SINGLETON
========================= */

let browser;

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
    }
    return browser;
}

/* =========================
   COOKIE WAITER (IMPORTANT)
========================= */

async function waitForCookie(page, name, timeout = 15000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const cookies = await page.cookies();
        const cookie = cookies.find(c => c.name === name);

        if (cookie) return cookie.value;

        await new Promise(r => setTimeout(r, 300));
    }

    return null;
}

/* =========================
   LOGIN FLOW
========================= */

async function login(username, password) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto("https://www.roblox.com/login", {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await page.waitForSelector('input[name="username"]');

        await page.type('input[name="username"]', username, { delay: 80 });
        await page.type('input[name="password"]', password, { delay: 80 });

        await Promise.all([
            page.click("#login-button"),
            page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {})
        ]);

        const sessionCookie = await waitForCookie(page, ".ROBLOSECURITY");

        await page.close();

        if (!sessionCookie) {
            return {
                result: false,
                session: null
            };
        }

        return {
            result: true,
            session: sessionCookie
        };

    } catch (err) {
        console.error("[LOGIN ERROR]", err);

        try {
            await page.close();
        } catch {}

        return {
            result: false,
            session: null
        };
    }
}

/* =========================
   CLEAN SHUTDOWN SAFETY
========================= */

process.on("exit", async () => {
    if (browser) await browser.close();
});

module.exports = login;