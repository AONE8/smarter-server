import puppeteer from "puppeteer";

const NAVIGATION_TIMEOUT_MS = 120000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function initializePageForScrapping(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        // "--single-process",
      ],
    });

    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);

    await page.setUserAgent(USER_AGENT);

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    if (!response) {
      throw new Error("Failed to get a response from URL");
    }

    return { page, response, browser };
  } catch (error) {
    console.error("Puppeteer Launch Error:", error.message);
    if (browser) await browser.close();
    throw error;
  }
}

export default initializePageForScrapping;
