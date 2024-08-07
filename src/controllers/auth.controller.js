const AuthService = require('../services/auth.service.js');
const Log = require('../utils/log.js');

const signIn = async (req, res) => {
  const signInResult = await AuthService.signIn(req);

  Log.request({
    req: req,
    msg: signInResult?.res?.msg,
    code: signInResult.status,
  });

  return res.status(signInResult.status).json(signInResult.res);
};

const signUp = async (req, res) => {
  const signUpResult = await AuthService.signUp(req);

  Log.request({
    req: req,
    msg: signUpResult?.res?.msg,
    code: signUpResult.status,
  });

  return res.status(signUpResult.status).json(signUpResult.res);
};

const refreshToken = async (req, res) => {
  const refreshTokenResult = await AuthService.refreshToken(req);

  Log.request({
    req: req,
    msg: refreshTokenResult?.res?.msg,
    code: refreshTokenResult.status,
  });

  return res.status(refreshTokenResult.status).json(refreshTokenResult.res);
};

const customToken = async (req, res) => {
  const customTokenResult = await AuthService.customToken(req);

  Log.request({
    req: req,
    msg: customTokenResult?.res?.msg,
    code: customTokenResult.status,
  });

  return res.status(customTokenResult.status).json(customTokenResult.res);
};

module.exports = {
  signUp,
  signIn,
  refreshToken,
  customToken,
};
