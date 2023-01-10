// this file is a document object.
// This object is returned from the google ai client when processing documents

class DocumentEntity {
  constructor(json) {
    this.confidence = json.confidence;
    this.id = json.id;
    this.mentionText = json.mentionText;
    this.pageAnchor = json.pageAnchor;
    this.textAnchor = json.textAnchor;
    this.type = json.type;
  }
}

export default DocumentEntity;