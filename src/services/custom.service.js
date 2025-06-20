const CustomModel = require('../models/custom.model.js');

const log = async req => {
  const {reason, device, version, appId} = req.body;

  const newCustom = new CustomModel({
    reason: reason,
    device: device,
    version: version,
    appId: appId,
  });

  const createCustomResult = await newCustom.save();

  if (createCustomResult == newCustom) {
    return {
      status: 200,
      res: {
        msg: 'Log Success!',
      },
    };
  }
};

const getAllCustoms = async () => {
  try {
    const customs = await CustomModel.find({}).sort({ createdAt: -1 }).limit(100);
    return {
      status: 200,
      res: {
        msg: 'Get customs success!',
        data: customs,
      },
    };
  } catch (error) {
    return {
      status: 500,
      res: {
        msg: 'Error getting customs data',
        error: error.message,
      },
    };
  }
};

module.exports = {
  log,
  getAllCustoms,
};
