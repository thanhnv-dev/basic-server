const UserModel = require('../models/user.model.js');
const JWToken = require('../middleware/JWToken.js');

const findUserByEmail = async email => {
  const result = await UserModel.findOne({
    email: email?.toLowerCase(),
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

const signUp = async req => {
  const {email} = req.body;

  const findUserByEmailResult = await findUserByEmail(email);

  if (findUserByEmailResult) {
    return {status: 400, res: {msg: 'Email was registered!'}};
  } else {
    const newUser = new UserModel({
      ...req.body,
    });

    const createUserResult = await newUser.save();

    if (createUserResult == newUser) {
      const {newToken, newRefreshToken} = JWToken.createTokens({email});

      const resData = createUserResult.toObject();
      resData.id = resData._id;
      delete resData._id;
      delete resData.password;
      delete resData.createdAt;
      delete resData.updatedAt;

      return {
        status: 200,
        res: {
          results: {...resData, token: newToken, refreshToken: newRefreshToken},
          msg: 'Sign Up Success!',
        },
      };
    } else {
      return {
        status: 400,
        res: {msg: 'Something went wrong!'},
      };
    }
  }
};

const profile = async req => {
  const {id} = req.query;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const email = findUserByIdResult.email;

    const {newToken, newRefreshToken} = JWToken.createTokens({email});

    const resUserData = findUserByIdResult.toObject();

    resUserData.id = resUserData._id;
    delete resUserData._id;
    delete resUserData.createdAt;
    delete resUserData.updatedAt;

    const res = {
      results: {...resUserData, token: newToken, refreshToken: newRefreshToken},
      msg: 'Get profile Successfully!',
    };
    return {status: 200, res};
  } else {
    return {
      status: 400,
      res: {msg: 'User does not exist!'},
    };
  }
};

const refreshToken = async req => {
  const {refreshToken} = req.body;

  const verifyRefreshTokenResult = JWToken.verifyRefreshToken(refreshToken);

  if (verifyRefreshTokenResult) {
    const {newToken, newRefreshToken} = JWToken.createTokens({
      data: refreshToken,
    });

    const res = {
      results: {token: newToken, refreshToken: newRefreshToken},
      msg: 'Refresh token Successfully!',
    };
    return {status: 200, res};
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden'},
    };
  }
};

const signIn = async req => {
  const {email, password} = req.body;

  const findUserByEmailAndPassword = await UserModel.findOne({
    email,
    password,
  });

  if (findUserByEmailAndPassword) {
    const {newToken, newRefreshToken} = JWToken.createTokens({email});

    const resUserData = findUserByEmailAndPassword.toObject();
    resUserData.id = resUserData._id;
    delete resUserData._id;
    delete resUserData.createdAt;
    delete resUserData.updatedAt;

    const res = {
      results: {
        ...resUserData,
        token: newToken,
        refreshToken: newRefreshToken,
      },
      msg: 'Sign In Successfully!',
    };
    return {status: 200, res};
  } else {
    return {
      status: 400,
      res: {msg: 'Account information is incorrect!'},
    };
  }
};

const customToken = async req => {
  const {expiresIn} = req.body;

  const newToken = JWToken.createCustomToken(expiresIn);

  const res = {
    results: {
      customToken: newToken,
    },
    msg: 'Create custom token Successfully!',
  };
  return {status: 200, res};
};

const deleteUser = async req => {
  const {email, password} = req.body;

  const findUserByEmailAndPassword = await UserModel.findOne({
    email,
    password,
  });
  if (findUserByEmailAndPassword) {
    const deleteUserResult = await UserModel.deleteOne({email});

    if (deleteUserResult.deletedCount) {
      const res = {
        msg: 'Account deleted successfully!',
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
      status: 400,
      res: {msg: 'Account information is incorrect!'},
    };
  }
};

module.exports = {
  signUp,
  profile,
  refreshToken,
  signIn,
  customToken,
  deleteUser,
};
