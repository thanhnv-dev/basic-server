const UserService = require('../services/user.service.js');
const Log = require('../utils/log.js');

const updateInformations = async (req, res) => {
  const {userName, email, password, dateOfBirth, gender, phoneNumber} =
    req.body;

  console.log('====================================');
  console.log('| [POST] /user/update-informations');
  console.log('| userName: ', userName);
  console.log('| email: ', email);
  console.log('| password: ', password);
  console.log('| dateOfBirth: ', dateOfBirth);
  console.log('| gender: ', gender);
  console.log('| phoneNumber: ', phoneNumber);
  console.log('| ----------------------------------');

  const updateInformationsResult = await UserService.updateInformations(req);

  console.log('|', updateInformationsResult.res.msg);

  console.log('====================================');
  return res
    .status(updateInformationsResult.status)
    .json(updateInformationsResult.res);
};

const signInWithGoogle = async (req, res) => {
  console.log('====================================');
  console.log('| [GET] /user/signin-with-google');
  console.log('| ----------------------------------');

  const signInWithGoogleResult = await UserService.signInWithGoogle(req);

  console.log('| ', signInWithGoogleResult.res.msg);
  console.log('====================================');

  return res
    .status(signInWithGoogleResult.status)
    .json(signInWithGoogleResult.res);
};

const signUpWithEmail = async (req, res) => {
  const {fullName} = req.body;

  console.log('====================================');
  console.log('| [POST] /user/signup-with-email');
  console.log('| fullName: ', fullName);
  console.log('| ----------------------------------');

  if (!fullName) {
    console.log('| Received data is not correct!!!');
    console.log('====================================');
    return res.status(400).json({msg: 'fullName field is required'});
  }

  const signUpResult = await UserService.signUpWithEmail(req);

  console.log('| ', signUpResult.res.msg);
  console.log('====================================');

  return res.status(signUpResult.status).json(signUpResult.res);
};

const updateAvatar = async (req, res) => {
  const {avatarLink} = req.body;
  console.log('====================================');
  console.log('| [POST] /user/update-image');
  console.log('| Avatar Link: ', avatarLink);
  console.log('| ----------------------------------');

  if (!avatarLink) {
    console.log('| Avatar Link not found');
    console.log('====================================');
    return res.status(400).send('Avatar Link is required!');
  }

  const uploadImageResult = await UserService.updateAvatar(req);

  if (uploadImageResult.status) {
    console.log('| ', uploadImageResult?.res?.msg);
    console.log('====================================');
    return res.status(uploadImageResult?.status).json(uploadImageResult?.res);
  }
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
  signUpWithEmail,
  profile,
  signInWithGoogle,
  updateAvatar,
  updateInformations,
  refreshToken,
};
