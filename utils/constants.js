const DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const DEFAULT_PORT = 3000;

const ALLOWED_DOMAINS = [
  'http://localhost:3001',
  'https://alicehab.nomoredomainsicu.ru',
];

const BAD_REQ_ERR = 'Ошибка в данных';
const CONFLICT_ERR = 'Введенные данные уже используются';
const FORBIDDEN_ERR = 'Недостаточно прав';
const NOT_FOUND_ERR = 'Запрос не найден';
const UNAUTHORIZED_ERR = 'Ошибка аутентификации';

const USER_REQUIRED_MESSAGES = {
  NAME: 'Введите имя',
  EMAIL: 'Введите email',
  PASSWORD: 'Введите пароль',
};
const USER_VALIDATE_MESSAGES = {
  NAME: 'Имя меньше 2 знаком или больше 30',
  EMAIL: 'Неверный email',
};

const MOVIE_REQUIRED_MESSAGES = {
  COUNTRY: 'Укажите страну',
  DIRECTOR: 'Укажите режиссера',
  DURATION: 'Укажите длительность фильма',
  YEAR: 'Укажите год',
  DESCRIPTION: 'Добавьте описание',
  IMAGE: 'Добавьте ссылку на постер',
  TRAILER_LINK: 'Добавьте ссылку на трейлер',
  THUMBNAIL: 'Добавьте ссылку на миниатюру',
  MOVIE_ID: 'Отсутствует id фильма',
  OWNER: 'Отсутствует id загрузившего фильм',
  NAME_RU: 'Укажите название на русском',
  NAME_EN: 'Укажите название на английском',
};
const MOVIE_VALIDATE_MESSAGES = {
  IMAGE: 'Неправильная ссылка на постер',
  TRAILER_LINK: 'Неправильная ссылка на трейлер',
  THUMBNAIL: 'Неправильная ссылка на миниатюру',
};

module.exports = {
  DB_URL,
  DEFAULT_PORT,
  ALLOWED_DOMAINS,
  BAD_REQ_ERR,
  CONFLICT_ERR,
  FORBIDDEN_ERR,
  NOT_FOUND_ERR,
  UNAUTHORIZED_ERR,
  USER_REQUIRED_MESSAGES,
  USER_VALIDATE_MESSAGES,
  MOVIE_REQUIRED_MESSAGES,
  MOVIE_VALIDATE_MESSAGES,
};
