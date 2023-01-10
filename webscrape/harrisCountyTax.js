import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

async function scrape() {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the web page
  await page.goto('https://www.hctax.net/Property/listings/taxsalelisting');

  // Wait for the page to load
  await page.waitForSelector('table');

  // Retrieve the HTML content of the page
  const html = await page.evaluate(() => document.body.innerHTML);

  // Close the browser
  await browser.close();

  // Load the HTML content into Cheerio
  const $ = cheerio.load(html);

  // Select the table containing the data
  const table = $('table');

  // Iterate over the rows of the table
  table.find('tr').each((index, element) => {
    // Extract the data from each cell of the row
    const cells = $(element).find('td');
    const parcelNumber = $(cells[0]).text();
    const ownerName = $(cells[1]).text();
    const propertyAddress = $(cells[2]).text();
    const saleDate = $(cells[3]).text();

    // Print the data to the console
    console.log(`Parcel Number: ${parcelNumber}`);
    console.log(`Owner Name: ${ownerName}`);
    console.log(`Property Address: ${propertyAddress}`);
    console.log(`Sale Date: ${saleDate}`);
  });
}

scrape();