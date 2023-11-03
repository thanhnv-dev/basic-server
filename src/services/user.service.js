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
      delete resData.password;
      delete resData.createdAt;
      delete resData.updatedAt;

      return {
        status: 200,
        res: {
          results: {
            ...resData,
            token: newToken,
            refresh_token: newRefreshToken,
          },
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

    delete resUserData.createdAt;
    delete resUserData.updatedAt;
    delete resUserData.password;

    const res = {
      results: {
        ...resUserData,
        token: newToken,
        refresh_token: newRefreshToken,
      },
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
  const {refresh_token} = req.body;

  const verifyRefreshTokenResult = JWToken.verifyRefreshToken(refresh_token);

  if (verifyRefreshTokenResult) {
    const {newToken, newRefreshToken} = JWToken.createTokens({
      data: refresh_token,
    });

    const res = {
      results: {token: newToken, refresh_token: newRefreshToken},
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
    delete resUserData.createdAt;
    delete resUserData.updatedAt;
    delete resUserData.password;

    const res = {
      results: {
        ...resUserData,
        token: newToken,
        refresh_token: newRefreshToken,
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
  const {expires_in} = req.body;

  const newToken = JWToken.createCustomToken(expires_in);

  const res = {
    results: {
      custom_token: newToken,
    },
    msg: 'Create custom token Successfully!',
  };
  return {status: 200, res};
};

const deleteUser = async req => {
  const {id} = req.query;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const deleteUserResult = await UserModel.deleteOne({
      _id: findUserByIdResult._id,
    });

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
