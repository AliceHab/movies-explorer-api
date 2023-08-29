const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./rate-limiter-conf');
const cookieParser = require('cookie-parser');

const NotFoundError = require('./errors/not-found-err');

const { createUser, login, signOut } = require('./controllers/users');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000, DB_URL } = process.env;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://alicehab.nomoreparties.co'],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(limiter);

app.use(cookieParser());

mongoose.connect(DB_URL, {});

// логгер запросов
app.use(requestLogger);

// регистрация, авторизация  и выход
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.get('/signout', signOut);

// Единый роут для фильмов и юзеров
app.use(helmet());
app.use(auth);
app.use(require('./routes/index'));

// eslint-disable-next-line no-unused-vars
app.use('*', (req, res) => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
