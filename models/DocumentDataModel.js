class DocumentDataModel {
  constructor() {
    this.documentId;
    this.grantors = [];
    this.originalPrincipal;
    this.reportedAddress;
  }

  addGrantor(grantor){
    this.grantors.push(grantor)
  }

  convertEntityToDocumentData(documentEntitiesArray){
    // iterate over all of the document entities and turn them into Document Data.
    documentEntitiesArray.forEach(entity => {
      const conf = entity.confidence * 100
      const confThreshold = 70;
      switch(entity.type){
        case 'document_id':
          if(conf > confThreshold){
            this.documentId = entity.mentionText;
          } else {
            console.log({level: "info", message: `Key ${entity.type} - not greater than ${confThreshold}`})
          }
          break;
        case 'grantor':
          if(conf > confThreshold){
            this.addGrantor(entity.mentionText);
          } else {
            console.log({level: "info", message: `Key ${entity.type} - not greater than ${confThreshold}`})
          }
          break;
        case 'original_principal':
          if(conf > confThreshold){
            this.originalPrincipal = entity.mentionText;
          } else {
            console.log({level: "info", message: `Key ${entity.type} - not greater than ${confThreshold}`})
          }
          break;
        case 'reported_address':
          if(conf > confThreshold){
            this.reportedAddress = entity.mentionText;
          } else {
            console.log({level: "info", message: `Key ${entity.type} - not greater than ${confThreshold}`})
          }
          break;
      }
    });
  }
}
  
  export default DocumentDataModel;