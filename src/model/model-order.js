const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelOrder = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    email: {
        type: String,
        default: ''
    },
    order: [
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