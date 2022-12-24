const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { scrapeTaxLiens } = require('./services/scrapeFunctions/scrapeTaxLiens');
const { csvToJSON } = require('./services/csvToJson');
const { readCollection, writeManyRecordsToCollection, writeOneRecordToCollection } = require('./services/mongo/mongoFunctions');
const { LeadModel } = require('./models/LeadModel');

const mongoRoutes = require('./routes/mongoDb');
const utilitiesRoutes = require('./routes/utilities');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('healthy');
})

app.use("/mongo", mongoRoutes);
app.use("/utilities", utilitiesRoutes);

http.createServer(app).listen(1337, () =>
console.log('express listening on port:', 1337));