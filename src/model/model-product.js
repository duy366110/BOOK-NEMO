const mongoose = require('mongoose');
const mongodb = require("mongodb");
const Schema = mongoose.Schema;

const ModelProduct = new Schema({
    title: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'products'
})

module.exports = mongoose.model('products', ModelProduct);