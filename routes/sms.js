const express = require('express');
const router = express.Router();

router.post('/forwardInboundMessage', (req, res) => {
  try{
    const client = require('twilio')(accountSid, authToken);
    forwardInboundMessage(twilioPNumber, forwardToPNumber, client, req);
    res.status(200).send('sms route reach with success');
  } catch {
    console.log('something went wrong:', Date.now());
    res.status(500).send('Server error');
  }
});
  
router.post('/sendSingleSMS', (req, res) => {
  try {
    const client = require('twilio')(accountSid, authToken);
    sendSingleSMS(client, req);
    res.status(200).send('your sms message was sent successfully!');
  } catch {
    console.log('Something went wrong here');
    res.status(500).send('Server error');
  }
});
  
router.post('/sendBulkSMS', async (req, res) => {
  const client = require('twilio')(accountSid, authToken);
  let recipients;
  var requestMock = JSON.stringify({
    "collection": process.env.MONGO_COLLECTION_NAME,
    "database": process.env.MONGO_DB_NAME,
    "dataSource": process.env.MONGO_DATA_SOURCE
  });
  
  try {
    let dataReadFromDb = await readCollection(requestMock)
    let documents = dataReadFromDb.documents;

    documents.forEach(item => {
      let lead = new LeadModel(item);
      let messageBody = `message is suppose to send here - name: ${lead.ownerFirstName} - NUmber: ${item.phone1}`;
      // First send message
      // ---> sendSingleSMS(client, messagingService, req);

      // Then add contacted attribute
      lead.contacted('SMS');
      console.log(lead);

      //Then push document to database
      // ---> writeOneRecordToCollection(lead)
    });
    res.status(200).send(documents);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;