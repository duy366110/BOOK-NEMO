"use strict"
require('dotenv').config();

const CLOUDINARY_CONFIG = {
    DEV: {
        DIRECTORY: process.env.DEV_CLOUDINARY_DIRECTORY,
        NAME: process.env.DEV_CLOUDINARY_NAME,
        KEY: process.env.DEV_CLOUDINARY_KEY,
        SERECT: process.env.DEV_CLOUDINARY_SECRET,
    },
    PRO: {
        DIRECTORY: process.env.PRO_CLOUDINARY_DIRECTORY,
        NAME: process.env.PRO_CLOUDINARY_NAME,
        KEY: process.env.PRO_CLOUDINARY_KEY,
        SERECT: process.env.PRO_CLOUDINARY_SECRET,
    }
}

const MODEL = process.env.MODEL;
const CONFIG =  CLOUDINARY_CONFIG[MODEL];
module.exports = CONFIG;