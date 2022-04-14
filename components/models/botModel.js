const mongoDB = require('../../databases/mongoDB');

module.exports.addSubscribers = async (simpleId, subscriberId) => {
    let subscribe = await mongoDB.getByQuery('subscribes', { simpleId });
    if (!subscribe) throw new Error('Такого канала для подписки не существует');
    if (!subscribe.subscribers.includes(subscriberId)) {
        return await mongoDB.updateByQuery('subscribes', 
            {
                simpleId: simpleId
            },
            { 
                $push: { subscribers: subscriberId } 
            }
        );
    }
}

module.exports.removeSubscribers = async (simpleId, subscriberId) => {
    let subscribe = await mongoDB.getByQuery('subscribes', { simpleId });
    if (!subscribe) throw new Error('Такого канала для подписки не существует');
    if (subscribe.subscribers.includes(subscriberId)) {
        let subscribers = subscribe.subscribers.filter(subscriber => subscriber != subscriberId);
        return await mongoDB.updateByQuery('subscribes', 
            {
                simpleId: simpleId
            },
            { 
                $pull: { subscribers: subscriberId } 
            }
        );
    }
}

module.exports.getSubscribe = async (simpleId) => {
    return await mongoDB.getByQuery('subscribes', { simpleId });
}

module.exports.addSubscribe = async (simpleId, title="Подписка") => {
    return await mongoDB.add('subscribes', {
        title: title,
        simpleId: simpleId,
        subscribers: []
    });
}