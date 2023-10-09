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

module.exports = {
  signUp,
  profile,
  signIn,
  refreshToken,
};
