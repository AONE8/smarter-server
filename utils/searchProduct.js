import { config } from "dotenv";

import initializePageForScrapping from "./initializePageForScrapping.js";

config({
  path: "../.env",
});

const titleSelector = process.env.TITLE_SELECTOR;
const imageSelector = process.env.IMAGE_SELECTOR;
const priceSelector = process.env.PRICE_SELECTOR;
const linkSelector = process.env.LINK_SELECTOR;
const vendorName = process.env.VENDOR_NAME;

export default async function searchProduct(queryString, deviceType) {
  let browser;
  try {
    const envKey = `${deviceType.toUpperCase()}_QUERY_URL`;
    const url = process.env[envKey] + queryString;
    const inquiredFilterPath = new URL(url).pathname
      .slice(0, -1)
      .split("/")
      .at(-1);

    const {
      _,
      page,
      browser: localBrowser,
    } = await initializePageForScrapping(url);

    browser = localBrowser;

    const gotUrl = new URL(page.url());

    const retievedFilterPath = gotUrl.pathname.slice(0, -1).split("/").at(-1);

    const isPathsEqual =
      inquiredFilterPath.length === retievedFilterPath.length;

    if (!isPathsEqual) {
      return null;
    }

    const title = await page.$eval(titleSelector, (el) => el.title);

    const imageURL = await page.$eval(imageSelector, (el) => el.src);

    const productURL = await page.$eval(linkSelector, (el) => el.href);

    const price = await page.$eval(priceSelector, (el) => el.textContent);

    const searchedDevice = {
      name: title,
      imgURL: imageURL,
      price: parseInt(price.replace(/[^\d]/g, "")),
      productURL: productURL,
      vendor: vendorName,
    };

    await browser.close();
    return searchedDevice;
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}
