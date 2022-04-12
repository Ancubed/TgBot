'use strict'

const express = require('express');
const router = express.Router();

const bot = require('../bot/bot');

const apiAccess = require('../middlewares/apiAccess');

const config = require('../../config.json');

router.use(apiAccess.isAuth);

router.get('/', (req, res) => {
    bot.sendMessage(357979728, 'Сообщение из express');
    res.send('<h1>Основной роут</h1>');
});

router.use((err, req, res, next) => {
    console.error(err);
    bot.sendMessage(config.adminChatId, `Ошибка при обработке запроса Express:\nIp-адрес:${req.ip}\n${err}`);
    res.status(err.status).json({ status: err.status, message: err.message });
});

module.exports = router;