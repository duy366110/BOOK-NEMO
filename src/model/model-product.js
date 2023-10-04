"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");

const ModelProduct = new Schema({
    title: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        required: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: CONFIG_DB.COLLECTIONS.CATEGORY
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    ref: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    collection: CONFIG_DB.COLLECTIONS.PRODUCT,
    timestamps: true
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.PRODUCT, ModelProduct);