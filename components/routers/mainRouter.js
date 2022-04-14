'use strict'

const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const bot = require('../bot/bot');
const botModel = require('../models/botModel');

const apiAccess = require('../middlewares/apiAccess');

const config = require('../../config.json');

router.use(apiAccess.isAuth);

router.get('/', async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: `Служебный чат бот НБ ОГУ. Вопросы - в telegram: ${config.admin.tag}`
        });
    } catch (err) {
        next(err);
    }
});

router.post('/send-message', async (req, res, next) => {
    try {
        let { chatId, message } = req.body;
        if (!chatId || !message) throw createError(400, 'Не передан chatId или message');

        bot.sendMessage(chatId, message);

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.post('/distribute-message', async (req, res, next) => {
    try {
        let { simpleId, message } = req.body;
        if (!simpleId || !message) throw createError(400, 'Не передан simpleId или message');

        let subscribe = await botModel.getSubscribe(simpleId);
        if (!subscribe) throw createError(404, 'Подписка не найдена');
        if (!subscribe.subscribers || subscribe.subscribers.length === 0) throw createError(404, 'У подписки нет подписчиков');

        subscribe.subscribers.map(subscriber => {
            bot.sendMessage(subscriber, message);
        });

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.use(async (err, req, res, next) => {
    try {
        bot.sendMessage(config.admin.chatId, `Ошибка при обработке запроса Express:\nIp-адрес:${req.ip}\n${err}`);
    } catch(err) {
        console.error(err);
    }
    console.error(err);
    res.status(err.status).json({ success: false, status: err.status, message: err.message });
});

module.exports = router;