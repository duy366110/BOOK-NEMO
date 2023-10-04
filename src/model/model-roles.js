"use strict"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG_DB = require("../configs/config.mongodb");

const ModelRole = new Schema({
    name: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: CONFIG_DB.COLLECTIONS.USER
        }
    ]
}, {
    collection: CONFIG_DB.COLLECTIONS.ROLE,
    timestamps: true
})

module.exports = mongoose.model(CONFIG_DB.COLLECTIONS.ROLE, ModelRole);