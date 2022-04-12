const TelegramBot = require('node-telegram-bot-api');

const config = require('../../config.json');

const bot = new TelegramBot(config.bot.token, { 
    polling: true,
    request: {
        proxy: config.proxy,
    }
});

bot.onText(/\/subscribe (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const id = match[1];
    
    console.log(chatId);

    bot.sendMessage(chatId, id);
});

bot.onText(/\/(help|start)/, msg => {
    bot.sendMessage(msg.chat.id, 'Это служебный бот, посылающий сотрудникам уведомления.\n\nДоступные команды:\n1) /subscribe <chanel> - подписка на канал, где <chanel> - id канала, на который вы подписываетесь. Для того, чтобы узнать id обратитесь к администратору.\n2) /help - справка по боту\n\nАдминистратор - @ancubed');
});

module.exports.sendMessage = (id, text) => {
    bot.sendMessage(id, text);
}