const express = require('express');

// Импорт основного роутера
const routers = require('./components/routers/mainRouter');

// Импорт бота для того, чтобы он работал
const bot = require('./components/bot/bot');

const config = require('./config.json');

const port = process.env.PORT || config.port;

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/favicon.ico', (req, res) => res.status(204));

app.use('/', routers);

app.listen(port, () => {
    console.log(`Express слушает ${port} порт.`);
});