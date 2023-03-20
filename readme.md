# TgBot
Own http telegram bot for my home server

# Install
`npm install`

# Functions
Users
- Subscribe/Unsubscribe from channels

Administrators
- Create/Delete channels
- Subscribe/Unsubscribe from channels

Everything is inside the chat with the bot

# Run
`npm run start` - Run

`npm run demon` - Run through nodemon

# Docker v20.10.7
1. `sudo docker build . -t tgbot --build-arg MONGO_URI=<URL> --build-arg PROXI_URI=<URL> --build-arg API_KEY=<KEY> --build-arg BOT_TOKEN=<TOKEN>` - Build
2. `sudo docker run --rm --network host tgbot` - Run
