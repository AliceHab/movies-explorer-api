const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { UNAUTHORIZED_ERR } = require('../utils/constants');

require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED_ERR);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED_ERR);
  }

  req.user = payload;
  next();
};
