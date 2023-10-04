"use strict"
require('dotenv').config();

const PAYPAL_CONFIG = {
    DEV: {
       CLIENT: process.env.DEV_PAYPAL_CLIENT,
       SERECT: process.env.DEV_PAYPAL_SERECT,
       PAGE_SUCCESS: process.env.DEV_PAYPAL_SUCCESS,
       PAGE_CANCEL: process.env.DEV_PAYPAL_CANCEL
    },
    PRO: {
        CLIENT: process.env.PRO_PAYPAL_CLIENT,
        SERECT: process.env.PRO_PAYPAL_SERECT,
        PAGE_SUCCESS: process.env.PRO_PAYPAL_SUCCESS,
        PAGE_CANCEL: process.env.PRO_PAYPAL_CANCEL
    }
}

const MODEL = process.env.MODEL;
const CONFIG =  PAYPAL_CONFIG[MODEL];
module.exports = CONFIG;