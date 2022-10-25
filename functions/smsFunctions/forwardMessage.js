exports.forwardInboundMessage = (twilioPNumber, forwardToPNumber, client, request) => {
  const messageObj = {
    body: `SOMEONE REPLIED TO YOUR SMS MARKETING: \n
    The number ${request.body.To} said: ${request.body.Body}`,
    from: twilioPNumber,
    to: forwardToPNumber
  }

  client.messages
    .create(messageObj)
    .then(() => console.log('Message was forwarded!'))
    .catch(error => console.log('something went wrong: ', error));
}
