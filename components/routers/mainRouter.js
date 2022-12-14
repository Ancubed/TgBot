'use strict'

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const geoip = require('geoip-lite');

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

        bot.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });

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
            bot.sendMessage(subscriber, `${subscribe.title || 'Рассылка без названия'}\n\n${message}`, { parse_mode: 'MarkdownV2' });
        });

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.use(async (err, req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        bot.sendMessage(config.admin.chatId, `URL: ${req.method} - ${req.originalUrl}\nОшибка при обработке запроса Express:
        \nIp-адрес:${ip}
        \nUser-agent:${req.get('User-Agent') || 'Не известно'}
        \nGeo-info:${JSON.stringify(geoip.lookup(ip)) || 'Не известно'}\n${err}`);
    } catch(err) {
        console.error(err);
    }
    console.error(err);
    res.status(err.status).json({ success: false, status: err.status, message: err.message });
});

module.exports = router;