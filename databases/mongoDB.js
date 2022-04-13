'use strict'

// Импорт классов mongo и конфига
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const config = require('../config.json').mongoDB;

// URI коннекта к базе монго
const MONGODB_URI = config.serverURI;

// Объект клиента mongo
const mongoClient = new mongodb.MongoClient(MONGODB_URI, { useUnifiedTopology: true });

const database = 'tg-bot';

// Переменная клиента к БД
let dbClient = null;

mongoClient.connect() // Получение клиента БД
.then(client => {
    console.log('Connection to Mongo is open');
    dbClient = client;
})
.catch(err => {
    console.error(err);
});

/**
 * Функция add - Добавление в коллекцию
 * @param {string} collection - Коллекция, в которую добавлять
 * @param {object} document - Документ
 * @returns Promise: resolve успешное добавление новости
 */

 module.exports.add = async (collection, document) => { // Добавление нового документа
    return await dbClient
        .db(database)
        .collection(collection)
        .insertOne(document);
}

/**
 * Функция getById - Получение документа по id
 * @param {string} collection - Коллекция, в которой искать
 * @param {string} id - Id документа
 * @returns массив документов
 */

 module.exports.getById = async (collection, id) => { // Получение документа по id
    return await dbClient
        .db(database)
        .collection(collection)
        .findOne({ _id: ObjectId(id) });
}

/**
 * Функция getByQuery - Получение документа по объекту
 * @param {string} collection - Коллекция, в которой искать
 * @param {string} query - Query объект для поиска 
 * @returns массив документов
 */

 module.exports.getByQuery = async (collection, query) => { // Получение документа по полю
    return await dbClient
        .db(database)
        .collection(collection)
        .findOne(query);
}

/**
 * Функция updateByQuery - Обновление документа по объекту
 * @param {string} collection - Коллекция, в которой искать
 * @param {string} query - Query объект для поиска 
 * @returns результат обновления
 */

 module.exports.updateByQuery = async (collection, findQuery, updateQuery) => { // Получение документа по полю
    return await dbClient
        .db(database)
        .collection(collection)
        .updateOne(findQuery, updateQuery);
}