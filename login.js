const { runPuppeteerTask } = require("./puppeteer.service");

async function login(username, password) {
    return runPuppeteerTask(async (page) => {

        await page.goto("https://www.roblox.com/login", {
            waitUntil: "domcontentloaded"
        });

        await page.waitForSelector('input[name="username"]');

        await page.type('input[name="username"]', username, { delay: 80 });
        await page.type('input[name="password"]', password, { delay: 80 });

        await Promise.all([
            page.click("#login-button"),
            page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {})
        ]);

        const cookies = await page.cookies();
        const session = cookies.find(c => c.name === ".ROBLOSECURITY");

        return {
            result: !!session,
            session: session?.value || null
        };
    });
}

module.exports = login;