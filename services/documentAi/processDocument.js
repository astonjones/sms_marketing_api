import * as documentAIClient from '@google-cloud/documentai';
import {Storage} from '@google-cloud/storage';
import fs from 'fs';
import PQueue from 'p-queue';

const processDocument = async (projectId, location, processorId, filePath, mimeType) => {
    const documentaiClient = new documentAIClient.v1.DocumentProcessorServiceClient();

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

    return [result.document];
}

// This function is used to batch process multiple documents.
const batchProcessDocument = async (projectId, location, processorId, gcsInputUri, gcsOutputUri, gcsOutputUriPrefix) => {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  const documentaiClient = new documentAIClient.v1.DocumentProcessorServiceClient();
  const storage = new Storage();

  let allFiles = await storage.bucket(gcsInputUri).getFiles()
  const fileNames = allFiles[0].map(fileName => ({
    gcsUri: `${gcsInputUri}/${fileName.name}`,
    mimeType: 'application/pdf'
  }));

  // Configure the batch process request.
  const request = {
    name,
    inputDocuments: {
      gcsDocuments: {
        documents: fileNames,
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

  const [operation] = await documentaiClient.batchProcessDocuments(request);

  // Wait for operation to complete.
  await operation.promise()
  console.log({ level: "info", message:'Document processing complete.'});

  // Query Storage bucket for the results file(s).
  const query = {
    prefix: gcsOutputUriPrefix,
  };
  console.log({ level: "info", message:'Fetching results ...'});

  // List all of the files in the Storage bucket
  const [files] = await storage.bucket(gcsOutputUri).getFiles(query);

  // Add all asynchronous downloads to queue for execution.
  const queue = new PQueue({concurrency: 15});
  const tasks = files.map((fileInfo, index) => async () => {
    // Get the file as a buffer
    const [file] = await fileInfo.download();
    // The results stored in the output Storage location
    // are formatted as a document object.
    const document = JSON.parse(file.toString());
  
    return document;
  });

  return queue.addAll(tasks);
}

// Extract key value pairs and confidence from processed document.
const keyValuePairs = async (documents) => {
  let extractedData = {};
  console.log('doc length', documents.length);

  for(const doc of documents){
    for (const entity of document.entities) {
      const key = entity.type;
      const textValue = entity.textAnchor !== null ? entity.textAnchor.content : '';
      const conf = entity.confidence * 100;
  
      extractedData[key] = textValue;
    }
  }

  return extractedData;
}

export {
  processDocument,
  keyValuePairs,
  batchProcessDocument
}