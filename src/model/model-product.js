const mongoose = require('mongoose');
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
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'products'
})

module.exports = mongoose.model('products', ModelProduct);