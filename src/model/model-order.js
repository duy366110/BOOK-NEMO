const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelOrder = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    collections: [
        {
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    collection: 'orders'
})

module.exports = mongoose.model('orders', ModelOrder);