const { chromium } = require("playwright");
const mail = process.env.TRENDYOL_SELLER_MAIL;
const password = process.env.TRENDYOL_SELLER_PASS;

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the website
  await page.goto("https://stagepartner.trendyol.com");

  // Fill in the email address
  await page.click('input[type="text"]'); // Adjust the selector if needed
  await page.fill('input[type="text"]', mail); // Adjust the selector if needed

  // Fill in the password
  await page.click('input[type="password"]'); // Adjust the selector if needed
  await page.fill('input[type="password"]', password); // Adjust the selector if needed

  // Click the login button
  await page.click('button[type="submit"]'); // Adjust the selector if needed

  // Wait for navigation after login (optional, but recommended)
  await page.waitForNavigation();

  // go to product list page
  await page.goto("https://stagepartner.trendyol.com/incentive");

  // Wait for the table to load
  /*   await page.waitForSelector("table__container"); */ // Replace with your table selector

  /*   // Select the largest page size from the dropdown
  await page.click(".select-input"); // Click to open the dropdown
  await page.click("bl-select-option:last-child"); // Select the last option (assumed to be the largest) */

  // Initialize an array to store prices
  let allPrices = [];

  let currentPage = 1;
  // Get all the bl-button elements within the "page-list"
  const pageButtons = await page.$$eval(
    ".page-list bl-button",
    (buttons) => buttons
  );

  // Get the last button and extract the total pages
  let totalPages = 10;
  if (pageButtons.length > 0) {
    const lastButton = pageButtons[pageButtons.length - 1];
    const labelText = await lastButton.evaluate((button) =>
      button.textContent.trim()
    );
    totalPages = parseInt(labelText, 10);
  }

  console.log("Total Pages:", totalPages);

  while (currentPage <= totalPages) {
    // Wait for the new page of the table to load after changing the page size or navigating to next page
    await page.waitForSelector(".table_loading", { state: "hidden" });

    /*     // wait for selector with the class .tr
    await page.waitForSelector("tr"); */

    //console.log tr
    const tr = await page.$$eval(".product-list-item-100");
    console.log("🚀 ~ tr:", tr);

    // Get the data from the current page
    const dataOnPage = await page.$$eval(".tr", (rows) =>
      rows.map((row) => {
        console.log(row);
        const price = row.querySelector('[cy-id="contentBuyboxPrice"]');
        const barcode = row.querySelector('[cy-id="contentBarcode"]');
        return { price, barcode };
      })
    );
    allPrices = [...allPrices, ...dataOnPage];

    // Navigate to the next page if not the last page
    if (currentPage < totalPages) {
      await page.click('button[aria-label="Next"]');
      currentPage++;
    }
  }
  console.log(allPrices);

  // Now allPrices contains the prices from all pages
  // Close the browser
  await browser.close();
})();
