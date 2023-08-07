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
    product_ref: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'products'
})

module.exports = mongoose.model('products', ModelProduct);