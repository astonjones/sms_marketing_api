const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Papa = require('papaparse');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { forwardInboundMessage } = require('./services/smsFunctions/forwardMessage');
const { sendSingleSMS } = require('./services/smsFunctions/sendSingleSMS');
const { sendBulkSMS } = require('./services/smsFunctions/sendBulkSMS');
const { scrapeTaxLiens } = require('./services/scrapeFunctions/scrapeTaxLiens');
const { csvToJSON } = require('./services/csvToJson');
const { readCollection, writeManyRecordsToCollection } = require('./services/mongo/mongoFunctions');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPNumber = process.env.MY_TWILIO_NUMBER;
const forwardToPNumber = process.env.MY_PHONE_NUMBER;
const messagingService = process.env.MESSAGING_SERVICE_SID;
const MONGO_CLUSTER_URI = process.env.MONGO_CLUSTER_URI;
const MONGO_API_KEY = process.env.MONGO_API_KEY;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('healthy');
})

// ------------- SMS Endpoints ------------------
app.post('/forwardInboundMessage', (req, res) => {
  try{
    const client = require('twilio')(accountSid, authToken);
    forwardInboundMessage(twilioPNumber, forwardToPNumber, client, req);
    res.status(200).send('sms route reach with success');
  } catch {
    console.log('something went wrong:', Date.now());
    res.status(500).send('Server error');
  }
});

app.post('/sendSingleSMS', (req, res) => {
  try {
    const client = require('twilio')(accountSid, authToken);
    sendSingleSMS(client, messagingService, req);
    res.status(200).send('your sms message was sent successfully!');
  } catch {
    console.log('Something went wrong here');
    res.status(500).send('Server error');
  }
});

app.post('/sendBulkSMS', async (req, res) => {
  let recipients;
  try {
    // here we need to populate recipients by fetching from mongo api
      // then add a contacted timestamp & channel

    // then we need to iterate over recipients to send a message
      // when message is sent we need to write lastContacted attribute
  } catch {

  }
})

// ---------------- End SMS Endpoints ---------------------

// --------------- Utility Endpoints -------------------------
app.post('/scrapeUrl', async (req, res) => {
  // in this endpoint we want scrape the given url
  // It should output an array of Objects with the url scraped data.
  let data = await scrapeTaxLiens();
  console.log(data);
  res.status(200).send(data);
})


app.post('/convertCSVtoMongoDB', async (req, res) => {
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

app.post('/readDB', async (req, res) => {
  var requestMock = JSON.stringify({
    "collection": process.env.MONGO_COLLECTION_NAME,
    "database": process.env.MONGO_DB_NAME,
    "dataSource": process.env.MONGO_DATA_SOURCE,
  });

  let data = await readCollection(requestMock);
  let documents = data.documents;
  res.status(200).send(documents);
});
// -------------- End of Web scrapping -----------------

http.createServer(app).listen(1337, () =>
console.log('express listening on port:', 1337));