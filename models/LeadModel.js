// This model is going to be the standard model for storing leads in my database
class LeadModel {
  constructor(address, city, state, zip, ownerFirstName, ownerLastName, phone1, phone2) {
    this.address = address;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.ownerFirstName = ownerFirstName;
    this.ownerLastName = ownerLastName;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.lastContacted = null;
    this.contactChannel = null
  }
}

function contacted(timestamp){
  this.lastContacted = timestamp;
}
  
module.exports = {
  LeadModel
}