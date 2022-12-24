const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');

const processDocument = async (projectId, location, processorId, filePath, mimeType) => {
    // Instantiates a client
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

    let extractedData = {};
    for (const entity of result.document.entities) {
        
        const key = entity.type;
        const textValue = entity.textAnchor !== null ? entity.textAnchor.content : '';
        const conf = entity.confidence * 100;

        // I need to make a filter of confidence score to judge value.

        extractedData[key] = textValue;
    }


    return extractedData;
}

module.exports = {
    processDocument: processDocument
}