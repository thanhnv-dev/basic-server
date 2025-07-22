const CustomModel = require('../models/custom.model.js');

const log = async req => {
  const {reason, device, version, appId, sessionId, env} = req.body;

  const newCustom = new CustomModel({
    reason: reason,
    device: device,
    version: version,
    appId: appId,
    sessionId: sessionId,
    env: env,
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
    const customs = await CustomModel.find({}).sort({createdAt: -1});
    const totalCount = await CustomModel.countDocuments({});
    
    return {
      status: 200,
      res: {
        msg: 'Get customs success!',
        data: customs,
        totalCount: totalCount,
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

const getCustomsByDate = async (startDate, endDate) => {
  try {
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const customs = await CustomModel.find(query).sort({createdAt: -1});
    const totalCount = await CustomModel.countDocuments(query);
    
    return {
      status: 200,
      res: {
        msg: 'Get customs by date success!',
        data: customs,
        totalCount: totalCount,
      },
    };
  } catch (error) {
    return {
      status: 500,
      res: {
        msg: 'Error getting customs data by date',
        error: error.message,
      },
    };
  }
};

module.exports = {
  log,
  getAllCustoms,
  getCustomsByDate,
};
