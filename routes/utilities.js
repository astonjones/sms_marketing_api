const express = require('express');
const router = express.Router();

router.post('/scrapeUrl', async (req, res) => {
  // in this endpoint we want scrape the given url
  // It should output an array of Objects with the url scraped data.
  let data = await scrapeTaxLiens();
  console.log(data);
  res.status(200).send(data);
})
  
  
router.post('/convertCSVtoMongoDB', async (req, res) => {
  let data;
  try {
    const csvFile = fs.createReadStream('./HTXVacantParsed.csv');
    data = await csvToJSON(csvFile);
    var requestMock = JSON.stringify({
      "collection": process.env.MONGO_COLLECTION_NAME,
      "database": process.env.MONGO_DB_NAME,
      "dataSource": process.env.MONGO_DATA_SOURCE,
      "documents": data
    });
    writeManyRecordsToCollection(requestMock);
    } catch {
    console.log('Something went wrong...');
    res.status(500).send('SERVER ERROR');
  }
  res.status(200).send('end of endpoint!')
})
  
router.post('/readDB', async (req, res) => {
  var requestMock = JSON.stringify({
    "collection": process.env.MONGO_COLLECTION_NAME,
    "database": process.env.MONGO_DB_NAME,
    "dataSource": process.env.MONGO_DATA_SOURCE,
  });

  let data = await readCollection(requestMock);
  let documents = data.documents;
  res.status(200).send(documents);
});

module.exports = router;