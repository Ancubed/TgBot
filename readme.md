# OSULibraryServiceTelegramBot
Служебный бот Научной Библиотеки ОГУ

# Установка
После скачивания, необходимо установить зависимости через пакетный менеджер [npm](https://www.npmjs.com/).
`npm install`

# Запуск
`npm run start` - Запуск приложения

`npm run demon` - Запуск через nodemon

# Развертывание Docker v20.10.7
1. `sudo docker build . -t webmaster/osu-lib-bot` - Сборка
2. `sudo docker run --rm --network host -d webmaster/osu-lib-bot` - Запуск