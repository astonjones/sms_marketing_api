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
      switch(entity.type){
        case 'document_id':
          this.documentId = entity.mentionText;
          break;
        case 'grantor':
          this.addGrantor(entity.mentionText);
          break;
        case 'original_principal':
          this.originalPrincipal = entity.mentionText;
          break;
        case 'reported_address':
          this.reportedAddress = entity.mentionText;
          break;
      }
    });
  }
}
  
  export default DocumentDataModel;