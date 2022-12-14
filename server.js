const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
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