const fs = require('fs');
const { parse } = require('csv-parse');
const { LeadModel } = require('../models/LeadModel');

const csvToJSON = async (csvReadStream) => {
  let data = [];
  return new Promise((resolve, reject) => {
    csvReadStream
    .pipe(parse({delimiter: ",", from_line: 2}))
    .on("data", row => {
      const lead = new LeadModel(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]);
      data.push(lead);
    })
    .on("end", () => { resolve(data) })
    .on("error", () => { return {message: "something went wrong in stream."}} )
  })
}

module.exports = {
  csvToJSON
}