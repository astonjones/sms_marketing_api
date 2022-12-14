const forwardToPNumber = process.env.MY_PHONE_NUMBER;
const messagingService = process.env.MESSAGING_SERVICE_SID;

const sendSingleSMS = (client, request) => {
  const messageObj = {
    body: request.body.Body,
    from: request.body.From ? request.body.From : fromPNumber,
    to: request.body.To
  }

  client.messages
    .create(messageObj)
    .then(() => console.log('That message sent successfully!'))
    .catch(error => console.log('something went wrong: ', error));
}   

module.exports = {
  sendSingleSMS: sendSingleSMS
}