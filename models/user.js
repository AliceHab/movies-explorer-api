const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');

const {
  USER_REQUIRED_MESSAGES,
  USER_VALIDATE_MESSAGES,
  UNAUTHORIZED_ERR,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, USER_REQUIRED_MESSAGES.NAME],
    minlength: [2, USER_VALIDATE_MESSAGES.NAME],
    maxlength: [30, USER_VALIDATE_MESSAGES.NAME],
  },
  email: {
    type: String,
    unique: true,
    required: [true, USER_REQUIRED_MESSAGES.EMAIL],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: USER_VALIDATE_MESSAGES.EMAIL,
    },
  },
  password: {
    type: String,
    required: [true, USER_REQUIRED_MESSAGES.PASSWORD],
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(UNAUTHORIZED_ERR);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(UNAUTHORIZED_ERR);
        }

        return user;
      });
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
