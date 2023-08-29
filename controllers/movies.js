const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');

// eslint-disable-next-line no-unused-vars
const checkDate = (err, res, errorText) => {
  if (err.name === 'ValidationError') {
    throw new BadRequestError('Ошибка в данных');
  }
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const user = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      } else if (!(movie.owner.toString() === user)) {
        throw new ForbiddenError('Ошибка аутентификации');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send({ data: deletedMovie });
          })
          .catch((err) => {
            if (err.kind === 'ObjectId') {
              throw new BadRequestError('Ошибка в данных');
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
      checkDate(err, res, 'Переданы некорректные данные при создании фильма');
      next(err);
    })
    .catch(next);
};
