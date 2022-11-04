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
const { readCollection, writeManyRecordsToCollection, writeOneRecordToCollection } = require('./services/mongo/mongoFunctions');
const { LeadModel } = require('./models/LeadModel');

const smsRoutes = require('./routes/sms');
const mongoRoutes = require('./routes/mongoDb');
const utilitiesRoutes = require('./routes/utilities');

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

app.use("/sms", smsRoutes);
app.use("/mongo", mongoRoutes);
app.use("/utilities", utilitiesRoutes);

http.createServer(app).listen(1337, () =>
console.log('express listening on port:', 1337));