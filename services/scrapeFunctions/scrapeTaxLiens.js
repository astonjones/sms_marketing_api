const puppeteer = require('puppeteer');

exports.scrapeTaxLiens = async () => {
  console.log('This function will return data from tax liens');
  let ssCount = 0;
  const width = 1024;
  const height = 1600;
  const htmlSelector = '.btn-link'
  const initialPage = 'https://www.hctax.net/Property/listings/taxsalelisting'

  const browser = await puppeteer.launch({ headless: false, 'defaultViewport' : { 'width' : width, 'height' : height }});
  const page = await browser.newPage();
  await page.goto(initialPage)
  await page.screenshot({path: `${++ssCount}.png`})

  try {
    await page.waitForSelector(htmlSelector);
    const selectorElement = await page.$eval(htmlSelector, elem => elem.click());
    console.log('selector', htmlSelector);

    await page.waitForTimeout(5000)
    let pages = await browser.pages();
    let pageUrls = await pages.map(item => item.url())
    browser.close();
    return pageUrls
  } catch (error){
    console.log("error", error)
  }
}