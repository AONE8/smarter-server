import { launch } from "puppeteer";

const NAVIGATION_TIMEOUT_MS = 120000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function initializePageForScrapping(url) {
  let browser;
  try {
    browser = await launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(USER_AGENT);

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    return { page, response, browser };
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

export default initializePageForScrapping;
