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

router.post('/processDocument', async (req, res) => {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
  const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string

  // Supported File Types
  // https://cloud.google.com/document-ai/docs/processors-list#processor_form-parser
  filePath = './doc_test.pdf'; // The local file in your current working directory
  mimeType = 'application/pdf';

  try{
    const document = await processDocument(projectId, location, processorId, filePath, mimeType);
    const extractedData = await extractFormData(document);
    // Here we should give out only the key value pairs
    console.log("Document Processing Complete");
    res.status(200).send(extractedData);
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error!');
  }

})

module.exports = router;