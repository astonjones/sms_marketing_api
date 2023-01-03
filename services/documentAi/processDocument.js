const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
import PQueue from 'p-queue';


const processDocument = async (projectId, location, processorId, filePath, mimeType) => {
    const documentaiClient = new DocumentProcessorServiceClient();

    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const resourceName = documentaiClient.processorPath(projectId, location, processorId);

    // Read the file into memory.
    const imageFile = fs.readFileSync(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');

    // Load Binary Data into Document AI RawDocument Object
    const rawDocument = {
        content: encodedImage,
        mimeType: mimeType,
    };

    // Configure ProcessRequest Object
    const request = {
        name: resourceName,
        rawDocument: rawDocument
    };

    // Use the Document AI client to process the sample form
    const [result] = await documentaiClient.processDocument(request);

    return result.document;
}

// Extract key value pairs and confidence from processed document.
const extractFormData = async (document) => {
  let extractedData = {};
  for (const entity of document.entities) {
    const key = entity.type;
    const textValue = entity.textAnchor !== null ? entity.textAnchor.content : '';
    const conf = entity.confidence * 100;

    extractedData[key] = textValue;
  }

  return extractedData;
}

// This function is used to batch process multiple documents.
async function batchProcessDocument(projectId, location, processorId, gcsInputUri, gcsOutputUri, gcsOutputUriPrefix) {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // Configure the batch process request.
  const request = {
    name,
    inputDocuments: {
      gcsDocuments: {
        documents: [
          {
            gcsUri: gcsInputUri,
            mimeType: 'application/pdf',
          },
        ],
      },
    },
    documentOutputConfig: {
      gcsOutputConfig: {
        gcsUri: `${gcsOutputUri}/${gcsOutputUriPrefix}/`,
      },
    },
  };

  // Batch process document using a long-running operation.
  // You can wait for now, or get results later.
  // Note: first request to the service takes longer than subsequent
  // requests.
  const [operation] = await client.batchProcessDocuments(request);

  // Wait for operation to complete.
  await operation.promise();
  console.log('Document processing complete.');

  // Query Storage bucket for the results file(s).
  const query = {
    prefix: gcsOutputUriPrefix,
  };

  console.log('Fetching results ...');

  // List all of the files in the Storage bucket
  const [files] = await storage.bucket(gcsOutputUri).getFiles(query);

  // Add all asynchronous downloads to queue for execution.
  const queue = new PQueue({concurrency: 15});
  const tasks = files.map((fileInfo, index) => async () => {
    // Get the file as a buffer
    const [file] = await fileInfo.download();

    console.log(`Fetched file #${index + 1}:`);

    // The results stored in the output Storage location
    // are formatted as a document object.
    const document = JSON.parse(file.toString());
    const {text} = document;

    // Extract shards from the text field
    const getText = textAnchor => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return '';
      }

      // First shard in document doesn't have startIndex property
      const startIndex = textAnchor.textSegments[0].startIndex || 0;
      const endIndex = textAnchor.textSegments[0].endIndex;

      return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    console.log('The document contains the following paragraphs:');

    const [page1] = document.pages;
    const {paragraphs} = page1;
    for (const paragraph of paragraphs) {
      const paragraphText = getText(paragraph.layout.textAnchor);
      console.log(`Paragraph text:\n${paragraphText}`);
    }

    // Form parsing provides additional output about
    // form-formatted PDFs. You  must create a form
    // processor in the Cloud Console to see full field details.
    console.log('\nThe following form key/value pairs were detected:');

    const {formFields} = page1;
    for (const field of formFields) {
      const fieldName = getText(field.fieldName.textAnchor);
      const fieldValue = getText(field.fieldValue.textAnchor);

      console.log('Extracted key value pair:');
      console.log(`\t(${fieldName}, ${fieldValue})`);
    }
  });
  await queue.addAll(tasks);
}

module.exports = {
  processDocument: processDocument,
  extractFormData: extractFormData,
  batchProcessDocument: batchProcessDocument
}