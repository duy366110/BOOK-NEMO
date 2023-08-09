const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelUser = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: 'P@ssword123'
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    cart: [
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
    ],
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders'
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'transactions'
        }
    ]
}, {
    collection: 'users'
})

module.exports = mongoose.model('users', ModelUser);