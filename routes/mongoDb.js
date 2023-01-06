import express from 'express';
const router = express.Router();

router.post('/health', async (req, res) => {
    res.status(200).send('Healthy');
});
    
router.post('/readDB', async (req, res) => {
  var requestMock = JSON.stringify({
    "collection": process.env.MONGO_COLLECTION_NAME,
    "database": process.env.MONGO_DB_NAME,
    "dataSource": process.env.MONGO_DATA_SOURCE,
  });

  let data = await readCollection(requestMock);
  let documents = data.documents;
  res.status(200).send(documents);
});

router.post('/convertCSVtoMongoDB', async (req, res) => {
  let data;
  try {
    const csvFile = fs.createReadStream('./HTXVacantParsed.csv');
    data = await csvToJSON(csvFile);
    var requestMock = JSON.stringify({
      "collection": process.env.MONGO_COLLECTION_NAME,
      "database": process.env.MONGO_DB_NAME,
      "dataSource": process.env.MONGO_DATA_SOURCE,
      "documents": data
    });
    writeManyRecordsToCollection(requestMock);
    } catch {
    console.log('Something went wrong...');
    res.status(500).send('SERVER ERROR');
  }
  res.status(200).send('end of endpoint!')
})

export default router;