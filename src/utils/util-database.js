const mongoose = require('mongoose');

class Mongodb  {
     
    constructor() { }

    connect = (callback) => {
        mongoose.connect(process.env.MONGODB_URI)
        .then((result) => {
            callback();
        })
        .catch((error) => {
            throw error;
        })
    }
}

module.exports = new Mongodb();