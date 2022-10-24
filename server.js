const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { forwardInboundMessage } = require('./functions/forwardMessage');
const { sendSingleSMS } = require('./functions/sendSingleSMS');
const { scrapeTaxLiens } = require('./functions/scrapeFunctions/scrapeTaxLiens');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPNumber = process.env.MY_TWILIO_NUMBER
const forwardToPNumber = process.env.MY_PHONE_NUMBER
const messagingService = process.env.MESSAGING_SERVICE_SID

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/health', (req, res) => {
  res.send('healthy');
})

// endpoint will forward inbound SMS to specified number.
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
    const client = require('twilio')(accountSid, authToken)
    sendSingleSMS(client, messagingService, req);
    res.status(200).send('your sms message was sent successfully!')
  } catch {
    console.log('Something went wrong here');
    res.status(500).send('Server error');
  }
});

app.post('/scrapeUrl', async (req, res) => {
  // in this endpoint we want scrape the given url
  // It should output an array of Objects with the url scraped data.
  let data = await scrapeTaxLiens();
  console.log(data);
  res.status(200).send(data)
})

http.createServer(app).listen(1337, () => 
console.log('express listening on port:', 1337))