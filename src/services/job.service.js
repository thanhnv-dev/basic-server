const JobModel = require('../models/job.model.js');
const FirebaseToken = require('../middleware/FirebaseToken.js');

const summary = async () => {
  const result = await JobModel.find({});

  const res = {
    results: result[0],
    msg: 'Get number of jobs successfully!',
  };
  return {status: 200, res};
};

module.exports = {
  summary,
};
