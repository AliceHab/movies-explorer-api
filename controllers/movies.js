const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  NOT_FOUND_ERR,
  BAD_REQ_ERR,
  FORBIDDEN_ERR,
} = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
const checkDate = (err, res) => {
  if (err.name === 'ValidationError') {
    throw new BadRequestError(BAD_REQ_ERR);
  }
};

module.exports.getMovies = (req, res, next) => {
  const user = req.user._id;

  Movie.find({ owner: user })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const user = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_ERR);
      } else if (!(movie.owner.toString() === user)) {
        throw new ForbiddenError(FORBIDDEN_ERR);
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send({ data: deletedMovie });
          })
          .catch((err) => {
            if (err.kind === 'ObjectId') {
              throw new BadRequestError(BAD_REQ_ERR);
            }
            next(err);
          });
      }
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      checkDate(err, res);
      next(err);
    })
    .catch(next);
};
