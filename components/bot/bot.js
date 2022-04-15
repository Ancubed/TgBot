const TelegramBot = require('node-telegram-bot-api');

const botModel = require('../models/botModel');

const config = require('../../config.json');

const botOptions = { 
    polling: true
}

if (process.env.NODE_ENV !== 'production') {
    botOptions.request = {
        proxy: config.proxy,
    }
}

const bot = new TelegramBot(config.bot.token, botOptions);

async function isAdmin(chatId) {
    if (chatId == config.admin.chatId) return true;
    bot.sendMessage(chatId, `Ошибка. У Вас нет разрешения на использование этой команды. Обратитесь к администратору - ${config.admin.tag}`);
    return false;
}

async function sendCustomError(errMsg, msg=null) {
    let err = new Error(`${errMsg}:\n${msg ? JSON.stringify(msg) : ''}`);
    console.error(err);
    bot.sendMessage(config.admin.chatId, `Ошибка при обработке сообщения в telegram:\n${err}`);
}

bot.onText(/\/subscribe (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const simpleId = match[1];

    try {
        await botModel.addSubscribers(simpleId, chatId);
    } catch (err) {
        bot.sendMessage(chatId, `Ошибка. ${err.message}. Обратитесь к администратору - ${config.admin.tag}`);
        return sendCustomError(`Ошибка при подписке. ${err.message}`, msg);
    }

    bot.sendMessage(chatId, 'Вы успешно подписались на рассылку.');
});

bot.onText(/\/unsubscribe (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const simpleId = match[1];

    try {
        await botModel.removeSubscribers(simpleId, chatId);
    } catch (err) {
        bot.sendMessage(chatId, `Ошибка. ${err.message}. Обратитесь к администратору - ${config.admin.tag}`);
        return sendCustomError(`Ошибка при отписке. ${err.message}`, msg);
    }

    bot.sendMessage(chatId, 'Вы успешно отписались от рассылки.');
});

bot.onText(/\/createsubscribe (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!(await isAdmin(chatId))) return sendCustomError(`Ошибка при попытке создать подписку.`, msg);

    const text = match[1];
    const textArr = text.split(/\s+/);

    if (textArr.length < 2) {
        return bot.sendMessage(chatId, `Ошибка. слишком мало аргументов у команды (должно быть 2 - simpleId и title). Обратитесь к администратору - ${config.admin.tag}`);
    }

    const simpleId = textArr[0];
    const title = textArr.splice(1).join(' ');

    try {
        await botModel.addSubscribe(simpleId, title);
    } catch (err) {
        bot.sendMessage(chatId, `Ошибка. ${err.message}. Обратитесь к администратору - ${config.admin.tag}`);
        return sendCustomError(`Ошибка при создании подписки. ${err.message}`, msg);
    }

    bot.sendMessage(chatId, 'Вы успешно создали рассылку.');
});

bot.onText(/\/(help|start)/, msg => {
    bot.sendMessage(msg.chat.id, `Это служебный бот, посылающий сотрудникам уведомления.

Доступные команды:
1) /subscribe <simpleId> - подписка на канал, где <simpleId> - id канала, на который вы подписываетесь. Для того, чтобы узнать id обратитесь к администратору.
2) /help - справка по боту
${config.admin.chatId == msg.chat.id ? `3) /createsubscribe <simpleId> <title> - создать канал
4) /unsubscribe <simpleId> - отписка от канала` : ''}
Администратор - ${config.admin.tag}`);
});

bot.on('polling_error', async (err) => {
   sendCustomError(err);
});

module.exports.sendMessage = (id, text) => {
    bot.sendMessage(id, text);
}