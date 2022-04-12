const createError = require('http-errors');

const config = require('../../config.json');

module.exports.isAuth = (req, res, next) => {
    //if (!req.headers.authorization || req.headers.authorization != config.apiKey) return next(createError(403, 'Не авторизован в API'));
    return next();
}