const { chromium } = require("playwright");
const mail = process.env.MAIL;
const password = process.env.PASSWORD;

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

  // FOR TEST ENVIRONMENT REMOVE LATER
  await page.getByRole("button", { name: "Hesabı Seç" }).nth(0).click();

  await page.waitForTimeout(2000);
  // go to incentive page
  await page.goto("https://stagepartner.trendyol.com/incentive");

  await page.locator("bl-radio[value='ALL_CATEGORIES']").click();
  await page.getByRole("button", { name: "Filtrele" }).click();

  await page.click("bl-select");
  await page.waitForSelector("bl-select-option");
  await page.getByText("100 Sonuç").click();
  const pageCount = await page.locator("ul[class='page-list'] > li").count();
  // Get the incentive info
  const incentiveInfo = [];
  const rowCount = await page.locator("tr").count();
  // Get the incentive info for each row in the table (except the header) and add it to the incentiveInfo array, when the page has more than 1 page it will loop through all the pages
  for (let i = 1; i < pageCount; i++) {
    for (let j = 1; j < rowCount; j++) {
      const category = await page
        .locator("tr")
        .nth(j)
        .locator("td")
        .nth(0)
        .innerText();
      const subCategory = await page
        .locator("tr")
        .nth(j)
        .locator("td")
        .nth(1)
        .innerText();
      const vade = await page
        .locator("tr")
        .nth(j)
        .locator("td")
        .nth(2)
        .innerText();
      const commissionRateWithVat = await page
        .locator("tr")
        .nth(j)
        .locator("td")
        .nth(3)
        .innerText();
      incentiveInfo.push({
        category,
        subCategory,
        vade,
        commissionRateWithVat,
      });
    }
    await page.locator("ul[class='page-list'] > li").nth(i).click();
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(2000);

  console.log(incentiveInfo);

  // Close the browser
  await browser.close();
})();
