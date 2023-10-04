"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");

const ModelOrder = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: CONFIG_DB.COLLECTIONS.USER
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
                ref: CONFIG_DB.COLLECTIONS.PRODUCT
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    collection: CONFIG_DB.COLLECTIONS.ORDER
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.ORDER, ModelOrder);