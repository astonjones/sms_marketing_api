const puppeteer = require('puppeteer');

exports.scrapeTaxLiens = async () => {
    console.log('This function will return data from tax liens');
    var SS_COUNT = 0;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.hctax.net/Property/listings/taxsalelisting')
    await page.screenshot({path: `${++SS_COUNT}.png`})

    // first get all data from modals on page
    const lengthOfRecordsOnPage = await page.evaluate(() => {
        const accountIdElementsLength = document.querySelectorAll('form.statement').length;
        return accountIdElementsLength
    })

    let data;
    let array = await lengthOfRecordsOnPage
    array.forEach(async (item, index) => {
        await page.click(`input[name="acct"]`)[index]
        await page.screenshot({path: `${++SS_COUNT}`})

        const somedata = await page.evaluate(() => {
            const something = document.querySelectorAll('tr')
            return something
        })

        data.push(somedata)
    })

    return data

    //After getting all Account Ids go to new pages and get data.
    // const data = await arrayOfAccountIds.map(async (item) => {
    //     await page.goto(`https://public.hcad.org/records/outsider/hc.asp?acct=${item}`)
    //     await page.screenshot({ path: `${++SS_COUNT}.png` })

    //     const address = await page.evaluate(() => {
    //         const something = document.querySelector('tr');
    //         console.log('something comes out', something)
    //         return something
    //     })

    //     return address;
    // })

    // return data;

}