"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");

const ModelTransaction = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    payment_id: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    collections: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: CONFIG_DB.COLLECTIONS.PRODUCT
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    collection: CONFIG_DB.COLLECTIONS.TRANSACTION,
    timestamps: true
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.TRANSACTION, ModelTransaction);