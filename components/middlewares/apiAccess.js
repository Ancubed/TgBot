const createError = require('http-errors');

const config = require('../../config.json');

module.exports.isAuth = (req, res, next) => {
    console.log(req.url);
    if (!req.headers.authorization || req.headers.authorization.split(/\s+/)[1] != config.apiKey) return next(createError(403, 'Не авторизован в API'));
    return next();
}