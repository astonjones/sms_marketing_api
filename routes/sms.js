const express = require('express');
const router = express.Router();
const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
})

// router.post('/forwardInboundMessage', (req, res) => {
//   try{
//     const client = require('twilio')(accountSid, authToken);
//     forwardInboundMessage(twilioPNumber, forwardToPNumber, client, req);
//     res.status(200).send('sms route reach with success');
//   } catch {
//     console.log('something went wrong:', Date.now());
//     res.status(500).send('Server error');
//   }
// });
  
router.post('/sendSingleSMS', (req, res) => {
  const from = "17199417106"
  const to = "18329109855"
  const text = "A test message using the Vonage SMS API -- appdaddy"
  try {
    vonage.message.sendSms(from, to, text, (err, responseData) => {
      console.log('This is the response data:', responseData);
    })
    res.status(200).send('Data went through!');
  } catch {
    console.log('There is an error in sendsingleSMS')
    res.status(500).send('Internal server error')
  }
});
  
// router.post('/sendBulkSMS', async (req, res) => {
//   const client = require('twilio')(accountSid, authToken);
//   let recipients;
//   var requestMock = JSON.stringify({
//     "collection": process.env.MONGO_COLLECTION_NAME,
//     "database": process.env.MONGO_DB_NAME,
//     "dataSource": process.env.MONGO_DATA_SOURCE
//   });
  
//   try {
//     let dataReadFromDb = await readCollection(requestMock)
//     let documents = dataReadFromDb.documents;

//     documents.forEach(item => {
//       let lead = new LeadModel(item);
//       let messageBody = `message is suppose to send here - name: ${lead.ownerFirstName} - NUmber: ${item.phone1}`;
//       // First send message
//       // ---> sendSingleSMS(client, messagingService, req);

//       // Then add contacted attribute
//       lead.contacted('SMS');
//       console.log(lead);

//       //Then push document to database
//       // ---> writeOneRecordToCollection(lead)
//     });
//     res.status(200).send(documents);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Internal server error');
//   }
// });

module.exports = router;