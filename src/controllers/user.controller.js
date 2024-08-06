const UserService = require('../services/user.service.js');
const Log = require('../utils/log.js');

const signIn = async (req, res) => {
  const signInResult = await UserService.signIn(req);

  Log.request({
    req: req,
    msg: signInResult?.res?.msg,
    code: signInResult.status,
  });

  return res.status(signInResult.status).json(signInResult.res);
};

const signUp = async (req, res) => {
  const signUpResult = await UserService.signUp(req);

  Log.request({
    req: req,
    msg: signUpResult?.res?.msg,
    code: signUpResult.status,
  });

  return res.status(signUpResult.status).json(signUpResult.res);
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

const refreshToken = async (req, res) => {
  const refreshTokenResult = await UserService.refreshToken(req);

  Log.request({
    req: req,
    msg: refreshTokenResult?.res?.msg,
    code: refreshTokenResult.status,
  });

  return res.status(refreshTokenResult.status).json(refreshTokenResult.res);
};

const customToken = async (req, res) => {
  const customTokenResult = await UserService.customToken(req);

  Log.request({
    req: req,
    msg: customTokenResult?.res?.msg,
    code: customTokenResult.status,
  });

  return res.status(customTokenResult.status).json(customTokenResult.res);
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

const updateImage = async (req, res) => {
  const uploadImageResult = await UserService.updateImage(req);

  Log.request({
    req: req,
    msg: uploadImageResult?.msg,
    code: uploadImageResult.status,
  });

  return res.status(uploadImageResult?.status).json(uploadImageResult?.res);
};

const updateInfomation = async (req, res) => {
  const updateInfomationResult = await UserService.updateImage(req);

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
  signUp,
  profile,
  signIn,
  refreshToken,
  customToken,
  deleteUser,
  updateImage,
  updateInfomation,
};
