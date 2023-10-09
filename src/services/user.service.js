const UserModel = require('../models/user.model.js');
const FirebaseToken = require('../middleware/FirebaseToken.js');
const JWToken = require('../middleware/JWToken.js');

const findUserByEmail = async email => {
  const result = await UserModel.findOne({
    email: email?.toLowerCase(),
  });

  return result;
};

const findUserByUiid = async uid => {
  const result = await UserModel.findOne({
    uid: uid,
  });

  return result;
};

const findUserById = async id => {
  try {
    const result = await UserModel.findById(id);
    return result;
  } catch (error) {
    return null;
  }
};

const findUser = async (email, password) => {
  const result = await UserModel.findOne({
    email: email?.toLowerCase(),
    password: password,
  });

  return result;
};

const findUserByToken = async token => {
  console.log('result true');

  const result = await UserModel.findOne({
    token,
  });

  return result;
};

const findUserByRefreshToken = async refreshToken => {
  const result = await UserModel.findOne({
    refreshToken,
  });

  return result;
};

const updateTokensWithEmail = async ({email, newToken, newRefreshToken}) => {
  const updateTokensResult = await UserModel.updateOne(
    {email},
    {$set: {token: newToken, refreshToken: newRefreshToken}},
  );

  // console.log('email', email);
  // console.log('newToken', newToken);
  // console.log('newRefreshToken', newRefreshToken);
  // console.log('updateTokensResult', updateTokensResult);

  return updateTokensResult.acknowledged;
};

const signUp = async req => {
  const {email} = req.body;

  const findUserByEmailResult = await findUserByEmail(email);

  if (findUserByEmailResult) {
    return {status: 400, res: {msg: 'Email was registered!'}};
  } else {
    const token = JWToken.createToken({email});
    const refreshToken = JWToken.createRefreshToken({email});

    const newUser = new UserModel({...req.body, token, refreshToken});

    const createUserResult = await newUser.save();
    const resData = createUserResult.toObject();
    resData.id = resData._id;
    delete resData._id;
    delete resData.password;
    delete resData.createdAt;
    delete resData.updatedAt;

    return {
      status: 200,
      res: {...resData, msg: 'Sign Up Success!'},
    };
  }
};

const profile = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const findUserByTokenResult = await findUserByToken(token);

  if (findUserByTokenResult) {
    const email = findUserByTokenResult.email;

    const {newToken, newRefreshToken} = JWToken.createTokens({email});

    const updateTokensResult = updateTokensWithEmail({
      email,
      newToken,
      newRefreshToken,
    });

    if (updateTokensResult) {
      const findUserByEmailResult = await findUserByEmail(email);

      const resUserData = findUserByEmailResult.toObject();

      resUserData.id = resUserData._id;
      delete resUserData._id;
      delete resUserData.createdAt;
      delete resUserData.updatedAt;
      const res = {
        results: resUserData,
        msg: 'Get profile Successfully!',
      };
      return {status: 200, res};
    } else {
      return {
        status: 400,
        res: {msg: 'Something went wrong!'},
      };
    }
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden'},
    };
  }
};

const refreshToken = async req => {
  const {refreshToken} = req.body;

  const verifyRefreshTokenResult = JWToken.verifyRefreshToken(refreshToken);

  if (verifyRefreshTokenResult) {
    const findUserByRefreshTokenResult = await findUserByRefreshToken(
      refreshToken,
    );

    const email = findUserByRefreshTokenResult.email;

    const {newToken, newRefreshToken} = JWToken.createTokens({email});

    const updateTokensResult = await updateTokensWithEmail({
      email,
      newToken,
      newRefreshToken,
    });

    if (updateTokensResult) {
      const res = {
        results: {token: newToken, refreshToken: newRefreshToken},
        msg: 'Refresh token Successfully!',
      };
      return {status: 200, res};
    } else {
      return {
        status: 400,
        res: {msg: 'Something went wrong!'},
      };
    }
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden'},
    };
  }
};

// const signInWithGoogle = async req => {
//   const userDataFirebase = await FirebaseToken.getUser(req);
//   if (userDataFirebase) {
//     const uid = userDataFirebase.uid;
//     const findIdResult = await findUserByUiid(uid);
//     const email = userDataFirebase.email;
//     const userName = userDataFirebase.displayName;

//     if (findIdResult) {
//       const resUserData = findIdResult.toObject();

//       resUserData.id = resUserData._id;
//       delete resUserData._id;
//       delete resUserData.createdAt;
//       delete resUserData.updatedAt;

//       const res = {
//         results: resUserData,
//         msg: 'Login Successfully!',
//       };

//       return {status: 200, res};
//     } else {
//       const type = 'google';

//       const newUser = new UserModel({
//         email,
//         uid,
//         userName,
//         type,
//       });

//       const createUser = await newUser.save();

//       if (createUser) {
//         const resUserData = createUser.toObject();

//         resUserData.id = resUserData._id;
//         delete resUserData._id;
//         delete resUserData.createdAt;
//         delete resUserData.updatedAt;

//         const res = {
//           results: resUserData,
//           msg: 'Login Successfully!',
//         };

//         return {status: 200, res};
//       } else {
//         return {
//           status: 400,
//           res: {msg: 'Something wrong!'},
//         };
//       }
//     }
//   } else {
//     return {
//       status: 400,
//       res: {msg: 'Something wrong. Please re-login!'},
//     };
//   }
// };

// const updateAvatar = async req => {
//   const {avatarLink} = req.body;

//   const userDataFirebase = await FirebaseToken.getUser(req);
//   if (userDataFirebase) {
//     const uid = userDataFirebase.uid;

//     await UserModel.updateOne(
//       {
//         uid,
//       },
//       {avatarLink},
//     );

//     const userDataBase = await findUserByUiid(uid);

//     if (userDataBase) {
//       const resUserData = userDataBase.toObject();
//       resUserData.id = resUserData._id;
//       delete resUserData._id;
//       delete resUserData.createdAt;
//       delete resUserData.updatedAt;
//       const res = {
//         results: resUserData,
//         msg: 'Update avatar successfully!',
//       };
//       return {status: 200, res};
//     } else {
//       return {
//         status: 400,
//         res: {msg: 'Account does not exist!'},
//       };
//     }
//   } else {
//     return {
//       status: 400,
//       res: {msg: 'Something wrong. Please re-signIn!'},
//     };
//   }
// };

// const updateInformations = async req => {
//   const {userName, dateOfBirth, gender, email, phoneNumber, location} =
//     req.body;
//   const userDataFirebase = await FirebaseToken.getUser(req);

//   if (userDataFirebase) {
//     const uid = userDataFirebase.uid;

//     if (userName) {
//       await UserModel.updateOne({uid}, {userName});
//     }

//     if (dateOfBirth) {
//       await UserModel.updateOne({uid}, {dateOfBirth});
//     }
//     if (gender) {
//       await UserModel.updateOne({uid}, {gender});
//     }

//     if (email) {
//       await UserModel.updateOne({uid}, {email});
//     }

//     if (phoneNumber) {
//       await UserModel.updateOne({uid}, {phoneNumber});
//     }

//     if (location) {
//       await UserModel.updateOne({uid}, {location});
//     }

//     const userDataBase = await findUserByUiid(uid);

//     if (userDataBase) {
//       const resUserData = userDataBase.toObject();
//       resUserData.id = resUserData._id;
//       delete resUserData._id;
//       delete resUserData.createdAt;
//       delete resUserData.updatedAt;
//       const res = {
//         results: resUserData,
//         msg: 'Update information successfully!',
//       };
//       return {status: 200, res};
//     } else {
//       return {
//         status: 400,
//         res: {msg: 'Account does not exist!'},
//       };
//     }
//   } else {
//     return {
//       status: 400,
//       res: {msg: 'Something wrong. Please re-signIn!'},
//     };
//   }
// };

module.exports = {
  findUserByEmail,
  findUser,
  signUp,
  profile,
  // signInWithGoogle,
  // updateAvatar,
  // updateInformations,
  refreshToken,
};
