const TelegramBot = require('node-telegram-bot-api');

const botModel = require('./botModel');

const config = require('../../config.json');

const bot = new TelegramBot(config.bot.token, { 
    polling: true,
    request: {
        proxy: config.proxy,
    }
});

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

bot.onText(/\/(help|start)/, msg => {
    bot.sendMessage(msg.chat.id, `Это служебный бот, посылающий сотрудникам уведомления.\n\nДоступные команды:\n1) /subscribe <chanel> - подписка на канал, где <chanel> - id канала, на который вы подписываетесь. Для того, чтобы узнать id обратитесь к администратору.\n2) /help - справка по боту\n\nАдминистратор - ${config.admin.tag}`);
});

bot.on('polling_error', async (err) => {
   sendCustomError(err);
});

module.exports.sendMessage = (id, text) => {
    bot.sendMessage(id, text);
}