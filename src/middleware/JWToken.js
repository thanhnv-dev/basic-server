const jwt = require('jsonwebtoken');
const {
  TOKEN_EXPIRES_TIME,
  REFRESH_TOKEN_EXPIRES_TIME,
  ACCESS_TOKEN_SECRET,
  ACCESS_REFRESH_TOKEN_SECRET,
} = require('../constants/index.js');

const createTokens = data => {
  const newToken = jwt.sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRES_TIME,
  });
  const newRefreshToken = jwt.sign(data, ACCESS_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_TIME,
  });
  return {newToken, newRefreshToken};
};

const createToken = data => {
  const token = jwt.sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRES_TIME,
  });
  return token;
};

const createCustomToken = expiresIn => {
  const token = jwt.sign({data: 'custom token'}, ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  return token;
};

const createRefreshToken = data => {
  const refreshToken = jwt.sign(data, ACCESS_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_TIME,
  });
  return refreshToken;
};

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  // 'Beaer [token]'
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1];
    if (!token) res.status(403).send({msg: 'Forbidden'});

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) return res.status(401).send({msg: 'Unauthorized'});
      next();
    });
  } else {
    res.status(403).send({msg: 'Forbidden'});
  }
};

const getTokenFromRequest = req => {
  const authorizationHeader = req.headers['authorization'];
  // 'Beaer [token]'
  return authorizationHeader?.split(' ')[1];
};

const checkToken = token => {
  if (!token) return 403;
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return 401;
    return true;
  });
};

const verifyRefreshToken = token => {
  return jwt.verify(token, ACCESS_REFRESH_TOKEN_SECRET, (err, data) => {
    return err ? false : true;
  });
};

module.exports = {
  createToken,
  createRefreshToken,
  verifyToken,
  checkToken,
  getTokenFromRequest,
  verifyRefreshToken,
  createTokens,
  createCustomToken,
};
