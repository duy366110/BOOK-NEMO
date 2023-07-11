const mongoose = require('mongoose');

class Mongodb  {
     
    constructor() { }

    connect = (callback) => {
        mongoose.connect('mongodb+srv://duy366110:aixpMCWSk7UoE3wz@book-nemo.ilmdak8.mongodb.net/?retryWrites=true&w=majority')
        .then((result) => {
            callback();
        })
        .catch((error) => {
            throw error;
        })
    }
}

module.exports = new Mongodb();