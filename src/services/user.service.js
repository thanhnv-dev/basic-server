const UserModel = require("../models/user.model.js");
const JWToken = require("../middleware/JWToken.js");

const findUserByEmail = async (email) => {
  const result = await UserModel.findOne({
    email: email?.toLowerCase(),
  });

  return result;
};

const findUserById = async (id) => {
  try {
    const result = await UserModel.findById(id);
    return result;
  } catch (error) {
    return null;
  }
};

const findUserByToken = async (token) => {
  const result = await UserModel.findOne({
    token,
  });

  return result;
};

const findUserByRefreshToken = async (refreshToken) => {
  const result = await UserModel.findOne({
    refreshToken,
  });

  return result;
};

const updateTokensWithEmail = async ({ email, newToken, newRefreshToken }) => {
  const updateTokensResult = await UserModel.updateOne(
    { email },
    { $set: { token: newToken, refreshToken: newRefreshToken } }
  );

  return updateTokensResult.acknowledged;
};

const signUp = async (req) => {
  const { email } = req.body;

  const findUserByEmailResult = await findUserByEmail(email);

  if (findUserByEmailResult) {
    return { status: 400, res: { msg: "Email was registered!" } };
  } else {
    const token = JWToken.createToken({ email });
    const refreshToken = JWToken.createRefreshToken({ email });

    const newUser = new UserModel({ ...req.body, token, refreshToken });

    const createUserResult = await newUser.save();
    const resData = createUserResult.toObject();
    resData.id = resData._id;
    delete resData._id;
    delete resData.password;
    delete resData.createdAt;
    delete resData.updatedAt;

    return {
      status: 200,
      res: { ...resData, msg: "Sign Up Success!" },
    };
  }
};

const profile = async (req) => {
  const token = JWToken.getTokenFromRequest(req);

  const findUserByTokenResult = await findUserByToken(token);

  if (findUserByTokenResult) {
    const email = findUserByTokenResult.email;

    const { newToken, newRefreshToken } = JWToken.createTokens({ email });

    const updateTokensResult = await updateTokensWithEmail({
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
        msg: "Get profile Successfully!",
      };
      return { status: 200, res };
    } else {
      return {
        status: 400,
        res: { msg: "Something went wrong!" },
      };
    }
  } else {
    return {
      status: 403,
      res: { msg: "Forbidden" },
    };
  }
};

const refreshToken = async (req) => {
  const { refreshToken } = req.body;

  const verifyRefreshTokenResult = JWToken.verifyRefreshToken(refreshToken);

  const findUserByRefreshTokenResult = await findUserByRefreshToken(
    refreshToken
  );

  if (verifyRefreshTokenResult && findUserByRefreshTokenResult) {
    const email = findUserByRefreshTokenResult?.email;

    const { newToken, newRefreshToken } = JWToken.createTokens({ email });

    const updateTokensResult = await updateTokensWithEmail({
      email,
      newToken,
      newRefreshToken,
    });

    if (updateTokensResult) {
      const res = {
        results: { token: newToken, refreshToken: newRefreshToken },
        msg: "Refresh token Successfully!",
      };
      return { status: 200, res };
    } else {
      return {
        status: 400,
        res: { msg: "Something went wrong!" },
      };
    }
  } else {
    return {
      status: 403,
      res: { msg: "Forbidden" },
    };
  }
};

const signIn = async (req) => {
  const { email, password } = req.body;

  const findUserByEmailAndPassword = UserModel.findOne({
    email,
    password,
  });

  if (findUserByEmailAndPassword) {
    const { newToken, newRefreshToken } = JWToken.createTokens({ email });

    const updateTokensResult = await updateTokensWithEmail({
      email,
      newToken,
      newRefreshToken,
    });

    if (updateTokensResult) {
      const res = {
        results: { token: newToken, refreshToken: newRefreshToken },
        msg: "Sign In Successfully!",
      };
      return { status: 200, res };
    } else {
      return {
        status: 400,
        res: { msg: "Something went wrong!" },
      };
    }
  } else {
    return {
      status: 400,
      res: { msg: "Account information is incorrect!" },
    };
  }
};

module.exports = {
  signUp,
  profile,
  refreshToken,
  signIn,
};
