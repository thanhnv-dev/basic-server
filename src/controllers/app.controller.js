const AppService = require('../services/app.service.js');
const Log = require('../utils/log.js');

const categories = async (req, res) => {
  const sendResult = await AppService.categories();

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};

const restaurents = async (req, res) => {
  const sendResult = await AppService.restaurents();

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};
const restaurent = async (req, res) => {
  const sendResult = await AppService.restaurent(req);

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};
const dish = async (req, res) => {
  const sendResult = await AppService.dish(req);

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};

module.exports = {
  categories,
  restaurents,
  restaurent,
  dish
};
