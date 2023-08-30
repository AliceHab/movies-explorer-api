const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');
const { updateUser, getCurrentUser } = require('../controllers/users');
const linkRegExp = require('../utils/regexp');

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.get('/movies', getMovies);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(linkRegExp),
      trailerLink: Joi.string().required().pattern(linkRegExp),
      thumbnail: Joi.string().required().pattern(linkRegExp),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

module.exports = router;
