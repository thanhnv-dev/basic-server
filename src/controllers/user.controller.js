const UserService = require('../services/user.service.js');
const Log = require('../utils/log.js');

const getDeliveryAddress = async (req, res) => {
  const getDeliveryAddressResult = await UserService.getDeliveryAddressResult(
    req,
  );

  Log.request({
    req: req,
    msg: getDeliveryAddressResult?.res?.msg,
    code: getDeliveryAddressResult.status,
  });

  return res
    .status(getDeliveryAddressResult.status)
    .json(getDeliveryAddressResult.res);
};

const updateDeliveryAddress = async (req, res) => {
  const updateDeliveryAddressResult = await UserService.updateDeliveryAddress(
    req,
  );

  Log.request({
    req: req,
    msg: updateDeliveryAddressResult?.res?.msg,
    code: updateDeliveryAddressResult.status,
  });

  return res
    .status(updateDeliveryAddressResult.status)
    .json(updateDeliveryAddressResult.res);
};

const profile = async (req, res) => {
  const profileResult = await UserService.profile(req);

  Log.request({
    req: req,
    msg: profileResult?.res?.msg,
    code: profileResult.status,
  });

  return res.status(profileResult.status).json(profileResult.res);
};

const deleteUser = async (req, res) => {
  const deleteUserResult = await UserService.deleteUser(req);

  Log.request({
    req: req,
    msg: deleteUserResult?.res?.msg,
    code: deleteUserResult.status,
  });

  return res.status(deleteUserResult.status).json(deleteUserResult.res);
};

const updateImage = async (req, res, err) => {
  let uploadImageResult;
  if (err) {
    uploadImageResult = {
      status: 400,
      res: {msg: 'File format is incorrect, only image files are accepted!'},
    };
  } else {
    uploadImageResult = await UserService.updateImage(req);
  }

  Log.request({
    req: req,
    msg: uploadImageResult?.msg,
    code: uploadImageResult.status,
  });

  return res.status(uploadImageResult?.status).json(uploadImageResult?.res);
};

const updateInfomations = async (req, res) => {
  const updateInfomationResult = await UserService.updateInfomations(req);

  Log.request({
    req: req,
    msg: updateInfomationResult?.msg,
    code: updateInfomationResult.status,
  });

  return res
    .status(updateInfomationResult?.status)
    .json(updateInfomationResult?.res);
};

const createDeliveryAddress = async (req, res) => {
  const createDeliveryAddressResult = await UserService.createDeliveryAddress(
    req,
  );

  Log.request({
    req: req,
    msg: createDeliveryAddressResult?.msg,
    code: createDeliveryAddressResult.status,
  });

  return res
    .status(createDeliveryAddressResult?.status)
    .json(createDeliveryAddressResult?.res);
};

const deleteDeliveryAddress = async (req, res) => {
  const deleteDeliveryAddressResult = await UserService.deleteDeliveryAddress(
    req,
  );
  Log.request({
    req: req,
    msg: deleteDeliveryAddressResult?.msg,
    code: deleteDeliveryAddressResult.status,
  });

  return res
    .status(deleteDeliveryAddressResult?.status)
    .json(deleteDeliveryAddressResult?.res);
};

module.exports = {
  profile,
  deleteUser,
  updateImage,
  updateInfomations,
  createDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
};
