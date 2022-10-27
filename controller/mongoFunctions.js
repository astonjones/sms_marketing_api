const axios = require('axios');

const readCollection = async (obj) => {
  let config = {
    method: 'post',
    url: process.env.MONGO_CLUSTER_URI + '/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': process.env.MONGO_API_KEY,
    },
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

const writeToDb = async (obj) => {
  let config = {
    method: 'post',
    url: process.env.MONGO_CLUSTER_URI + '/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': process.env.MONGO_API_KEY,
    },
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

  module.exports = {
    readCollection: readCollection
  };