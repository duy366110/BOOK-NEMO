"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");


const ModelCategory = new Schema({
    name: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: CONFIG_DB.COLLECTIONS.PRODUCT
        }
    ]
}, {
    collection: CONFIG_DB.COLLECTIONS.CATEGORY,
    timestamps: true
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.CATEGORY, ModelCategory);