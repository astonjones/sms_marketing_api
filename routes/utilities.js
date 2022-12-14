const express = require('express');
const router = express.Router();
const { processDocument, extractFormData } = require('../services/documentAi/processDocument');

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

router.post('/processDocument', async (req, res) => {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
  const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string

  // Supported File Types
  // https://cloud.google.com/document-ai/docs/processors-list#processor_form-parser
  filePath = './even_more_test.pdf'; // The local file in your current working directory
  mimeType = 'application/pdf';

  try{
    const document = await processDocument(projectId, location, processorId, filePath, mimeType);
    const formData = await extractFormData(document);
    console.log("Document Processing Complete");
      // Print the document text as one big string
    console.log(`Form Data: ${formData}`);
    res.status(200).send(formData)
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error!');
  }

})

module.exports = router;