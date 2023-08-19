"use strict"
require('dotenv').config();
const mongoose = require('mongoose');
const CONFIG = require("../configs/config.mongodb");
const Helper = require("../helpers/helper");
class Mongodb  {
     
    constructor() {
        this.#connect();
    }

    static getInstance() {
        if(!Mongodb.instance) {
            Mongodb.instance = new Mongodb();
        }

        return Mongodb.instance;
    }

    #connect = (type = 'mongodb') => {
        // MODE DEV
        if(1 === 2) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(CONFIG.URI)
        .then((result) => {
            console.log("Connect DB successfully");
            Helper.connectCount();
        })
        .catch((error) => {
            console.log("Connect DB failed" + error);
        })
    }
}

const mongodbInstance = Mongodb.getInstance();
module.exports = mongodbInstance;