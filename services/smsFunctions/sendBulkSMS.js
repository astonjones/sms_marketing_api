exports.sendBulkSMS = (client, messagingService, recipients, messageBody) => {
  /* 
    The request has to include a name, property, and a phone number.
      - Ideally we would want to add the recipients name and property to the text
    This will most likely come in the form of an array of JSON objects or a csv file that will convert to 
    request.body.recipient = [{property: "1234 Main St", name: "PersonName", phone: "+1(555)-555-5555"}, {...}, {...}]
    request.body.Body = "String of what you want to send to the recipients";
  */
    Promise.all(
      recipients.map(profile => {
        return client.messages.create({
          to: profile.phoneNumber,
          from: messagingService,
          body: messageBody
        })
      })
    )
}