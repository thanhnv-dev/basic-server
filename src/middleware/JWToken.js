const jwt = require('jsonwebtoken');
const {
  TOKEN_EXPIRES_TIME,
  REFRESH_TOKEN_EXPIRES_TIME,
  ACCESS_TOKEN_SECRET,
  ACCESS_REFRESH_TOKEN_SECRET,
} = require('../constants/index.js');

const createToken = data => {
  const token = jwt.sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRES_TIME,
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

module.exports = {createToken, createRefreshToken, verifyToken};
