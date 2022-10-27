// This model is used to send SMS
class Recipient {
  constructor(fName, lName, address, phoneNumber) {
    this.fName = fName;
    this.lName = lName;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }
}

module.exports = { 
  Recipient
}