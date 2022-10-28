const axios = require('axios');
const mongoUri = process.env.MONGO_CLUSTER_URI

const reqHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': process.env.MONGO_API_KEY,
}

const readCollection = async (obj) => {
  let config = {
    method: 'post',
    url: mongoUri + '/action/find',
    headers: reqHeaders,
    data: obj
  };
    
  try {
    let axiosRequest = await axios(config);
    return axiosRequest.data;
  } catch(err) {
    console.log('within axios request');
    return { message: "something went wrong"}
  }

}

const writeOneRecordToCollection = async (obj) => {
  let config = {
    method: 'post',
    url: mongoUri + '/action/findOne',
    headers: reqHeaders,
    data: obj
  };
    
  try {
    let axiosRequest = await axios(config);
    return axiosRequest.data;
  } catch(err) {
    console.log('within axios request');
    return { message: "something went wrong"}
  }

}

const writeManyRecordsToCollection = async (records) => {
  let config = {
    method: 'post',
    url: mongoUri + '/action/insertMany',
    headers: reqHeaders,
    data: records
  };
    
  try {
    let axiosRequest = await axios(config);
    return axiosRequest.data;
  } catch(err) {
    console.log('within axios request');
    return { message: "something went wrong"}
  }

}

module.exports = {
  readCollection: readCollection,
  writeOneRecordToCollection: writeOneRecordToCollection,
  writeManyRecordsToCollection: writeManyRecordsToCollection
};