const fs = require('fs');
const { parse } = require('csv-parse');
const recipientModel = require('../models/RecipientModel');
const Recipient = recipientModel.Recipient;
const { writeToDb } = require('./mongoFunctions');
const { callbackify } = require('util');

const csvToJSON = async (csvReadStream) => {
  let data = [];
  return new Promise((resolve, reject) => {
    csvReadStream
    .pipe(parse({delimiter: ",", from_line: 2}))
    .on("data", row => {
      const recipient = new Recipient(row[0], row[1], row[2], row[3]);
      data.push(recipient);
    })
    .on("end", () => { resolve(data) })
    .on("error", () => { return {message: "something went wrong in stream."}} )
  })
  
}

module.exports = {
  csvToJSON
}