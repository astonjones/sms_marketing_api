import express from 'express';
const router = express.Router();
import { processDocument, keyValuePairs, batchProcessDocument } from '../services/documentAi/processDocument.js';
import documentsToCsv from '../services/csvFunctions.js';
import {v4 as uuidv4} from 'uuid';

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
  const filePath = './doc_test.pdf'; // The local file in your current working directory
  const mimeType = 'application/pdf';

  try{
    const document = await processDocument(projectId, location, processorId, filePath, mimeType);
    const extractedData = await keyValuePairs(document);
    // Here we should give out only the key value pairs
    res.status(200).send(extractedData);
  } catch(err) {
    console.log(err.statusDetails);
    res.status(500).send({message: 'Internal Server Error!'});
  }

})

router.post('/batchProcess', async (req, res) => {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
  const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
  const gcsInputUri = process.env.GCS_INPUT_URI;
  const gcsOutputUri = process.env.GCS_OUTPUT_URI;
  const gcsOutputUriPrefix = uuidv4();
  const mimeType = 'application/pdf'

  try{
    const documents = await batchProcessDocument(projectId, location, processorId, gcsInputUri, gcsOutputUri, gcsOutputUriPrefix);
    await documentsToCsv(documents, './Foreclosure.csv');
    res.status(200).send({message: 'Data has been written to a csv file!'});
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

export default router;