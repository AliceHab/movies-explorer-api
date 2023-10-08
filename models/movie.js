const mongoose = require('mongoose');
const validator = require('validator');

const {
  MOVIE_REQUIRED_MESSAGES,
  MOVIE_VALIDATE_MESSAGES,
} = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.COUNTRY],
  },
  director: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.DIRECTOR],
  },
  duration: {
    type: Number,
    required: [true, MOVIE_REQUIRED_MESSAGES.DURATION],
  },
  year: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.YEAR],
  },
  description: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.DESCRIPTION],
  },
  image: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.IMAGE],
  },
  trailerLink: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.TRAILER_LINK],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: (props) => `${props.value} - ${MOVIE_VALIDATE_MESSAGES.TRAILER.LINK}`,
    },
  },
  thumbnail: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.THUMBNAIL],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, MOVIE_REQUIRED_MESSAGES.OWNER],
  },
  movieId: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.MOVIE_ID],
  },
  nameRU: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.NAME_RU],
  },
  nameEN: {
    type: String,
    required: [true, MOVIE_REQUIRED_MESSAGES.NAME_EN],
  },
});

module.exports = mongoose.model('movie', movieSchema);
