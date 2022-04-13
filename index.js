const express = require('express');

// Импорт основного роутера
const routers = require('./components/routers/mainRouter');

// Импорт бота для того, чтобы он работал
const bot = require('./components/bot/bot');

const config = require('./config.json');

const url = config.url;
const port = config.port;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/', routers);

app.listen(port, () => {
    console.log(`Express слушает ${port} порт.`);
});