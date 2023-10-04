"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");

const ModelUser = new Schema({
    name: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    email: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    password: {
        type: String,
        default: 'P@ssword123',
        required: true,
        trim: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: CONFIG_DB.COLLECTIONS.ROLE,
        required: true
    },
    cart: [
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
    ],
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: CONFIG_DB.COLLECTIONS.ORDER
    },
    status: {
        type: Boolean,
        default: true
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: CONFIG_DB.COLLECTIONS.TRANSACTION
        }
    ]
}, {
    collection: CONFIG_DB.COLLECTIONS.USER,
    timestamps: true
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.USER, ModelUser);