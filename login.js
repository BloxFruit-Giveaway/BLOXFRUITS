const axios = require('axios');
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const API_KEY = "CAP-FB4B0BEB9EA6F42CE6CF95EA2CB8FDEE955782A1469C2F5C3F4940C5A7BFC89B";

async function createTask() {
  const res = await axios.post("https://api.capsolver.com/createTask", {
    clientKey: API_KEY,
    task: {
      type: "FunCaptchaTaskProxyless",
      websiteURL: "https://www.roblox.com",
      websitePublicKey: "A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F",
      data: {
        blob: "This value is different each time, it's in the header as rbx challenge, base64"
      }
    }
  });
  if (res.data.errorId !== 0) {
    throw new Error(res.data.errorDescription || "createTask failed");
  }
  return res.data.taskId;
}

async function getResult(taskId) {
  while (true) {
    const res = await axios.post("https://api.capsolver.com/getTaskResult", {
      clientKey: API_KEY,
      taskId: taskId
    });

    const data = res.data;
    if (data.errorId !== 0) {
      throw new Error(data.errorDescription || "getTaskResult failed");
    }
    if (data.status === "ready") {
      return data.solution;
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}


async function main() {
  try {
    console.log("Creating task...");
    const taskId = await createTask();
    console.log("Task ID:", taskId);
    console.log("Waiting for solution...");
    const solution = await getResult(taskId);
    console.log("Solved:", solution);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

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
    waitUntil: 'networkidle2'
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

  const hasCaptcha = await page.$(".captcha, iframe[src*='captcha'], div[id*='captcha']");
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (hasCaptcha) {
      console.log("Captcha detected");
      main()
    }
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