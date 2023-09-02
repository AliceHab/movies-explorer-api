const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-unused-vars
const cookieParser = require('cookie-parser');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const {
  NOT_FOUND_ERR,
  BAD_REQ_ERR,
  UNAUTHORIZED_ERR,
  CONFLICT_ERR,
} = require('../utils/constants');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  const owner = req.user._id;

  User.findById(owner)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(NOT_FOUND_ERR);
      } else if (err.kind === 'ObjectId') {
        throw new BadRequestError(BAD_REQ_ERR);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(NOT_FOUND_ERR);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError(BAD_REQ_ERR);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const {
        // eslint-disable-next-line no-shadow
        _id, name, about, avatar, email,
      } = user;
      // eslint-disable-next-line no-shadow
      res.status(201).send({
        data: {
          _id,
          name,
          about,
          avatar,
          email,
        },
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err.name === 'ValidationError') {
        throw new BadRequestError(BAD_REQ_ERR);
      }
      if (err.code === 11000) {
        throw new ConflictError(CONFLICT_ERR);
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );

      res.cookie('jwt', token, {
        maxAge: 604900,
        httpOnly: true,
        sameSite: true,
      });

      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(BAD_REQ_ERR);
      } else {
        throw new UnauthorizedError(UNAUTHORIZED_ERR);
      }
    })
    .catch(next);
};

module.exports.signOut = (req, res, next) => {
  res.clearCookie('jwt', {
    maxAge: 604900,
    httpOnly: true,
    sameSite: true,
  });

  res.status(200).send({ message: 'Cookie cleared' }).catch(next);
};
