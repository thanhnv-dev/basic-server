const mongoose = require('mongoose');
const {URI_MONGODB} = require('../constants/index.js');

mongoose.set('strictQuery', true);

const connect = async () => {
  try {
    await mongoose.connect(URI_MONGODB);
    console.log('Connected MongoDB cloud');
  } catch (error) {
    console.log('error_connect_mongodb', error);
    process.exit();
  }
};

module.exports = {connect};
