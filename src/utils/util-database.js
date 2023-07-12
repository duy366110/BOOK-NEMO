const mongoose = require('mongoose');

class Mongodb  {
     
    constructor() { }

    connect = (callback) => {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book_nemo')
        .then((result) => {
            callback();
        })
        .catch((error) => {
            throw error;
        })
    }
}

module.exports = new Mongodb();