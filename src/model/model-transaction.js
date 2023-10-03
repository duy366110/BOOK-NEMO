"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelTransaction = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    payment_id: {
        type: String,
        default: ''
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    collections: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    collection: 'transactions'
})

module.exports = mongoose.model('transactions', ModelTransaction);