const axios = require('axios');
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const API_KEY = "CAP-FB4B0BEB9EA6F42CE6CF95EA2CB8FDEE955782A1469C2F5C3F4940C5A7BFC89B";

const fakeType = (page, input, value) => {
  return new Promise((resolve, reject) => {
    const baseTime = 100;
    const type = page.type.bind(page);
    let current = 0;
    for (let i = 0; i < value.length; i++) {
      current += baseTime;
      setTimeout(type, current, input, value.charAt(i));
    }
    setTimeout(resolve, current);
  });
};

async function login(username, password)
{
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    slowMo: 100
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://www.roblox.com/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForSelector('input[name="username"]');
  await page.click('input[name="username"]');
  await fakeType(page, 'input[name="username"]', username);
  await page.click('input[name="password"]');
  await fakeType(page, 'input[name="password"]', password);
  const loginButton = await page.$('#login-button');
  if (loginButton) {
    await loginButton.click();
  } else {
    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const cookies = await page.cookies();
    let sessionCookie;
    
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === '.ROBLOSECURITY') {
          sessionCookie = cookies[i].value;
          console.log("Got Session Cookie");
          break;
        }
    }
    console.log("Browser Closing");
    await browser.close();
    if (!sessionCookie) {
      console.log("No Session Cookie");
      return {
        result: false,
          session: null
        };
      } else {
        console.log("Has Session Cookie");
        return {
          result: true,
          session: sessionCookie
        };
      }
    } catch (e) {
      console.error(e);
      await browser.close();
      return {
        result: false,
        session: null
      };
    }
}

module.exports = login;
