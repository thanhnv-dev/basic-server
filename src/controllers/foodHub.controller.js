const FoodHubService = require('../services/foodHub.service.js');
const Log = require('../utils/log.js');

const categories = async (req, res) => {
  const sendResult = await FoodHubService.categories();

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};

const restaurents = async (req, res) => {
  const sendResult = await FoodHubService.restaurents();

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};
const restaurent = async (req, res) => {
  const sendResult = await FoodHubService.restaurent(req);

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};
const dish = async (req, res) => {
  const sendResult = await FoodHubService.dish(req);

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
