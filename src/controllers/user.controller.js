const UserService = require('../services/user.service.js');
const Log = require('../utils/log.js');

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

module.exports = {
  profile,
  deleteUser,
  updateImage,
  updateInfomations,
};
