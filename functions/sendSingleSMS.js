exports.sendSingleSMS = (client, fromPNumber, request) => {
  const messageObj = {
    body: request.body.Body,
    from: request.body.From ? request.body.From : fromPNumber,
    to: request.body.To
  }

  console.log('This is the message Object - ', messageObj)
  client.messages
    .create(messageObj)
    .then(() => console.log('That message sent successfully!'))
    .catch(error => console.log('something went wrong: ', error));
}