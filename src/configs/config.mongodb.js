"use strict"
require('dotenv').config();

const MONGODB_CONFIG = {
    DEV: {
        URI: process.env.MONGODB_DEV_URL,
        COLLECTIONS: {
            CATEGORY: 'categories',
            PRODUCT: 'products',
            ORDER: 'orders',
            ROLE: 'roles',
            TRANSACTION: 'transactions',
            USER: 'users'
        }
    },
    PRO: {
        URI: process.env.MONGODB_PRO_URL,
        COLLECTIONS: {
            CATEGORY: 'categories',
            PRODUCT: 'products',
            ORDER: 'orders',
            ROLE: 'roles',
            TRANSACTION: 'transactions',
            USER: 'users'
        }
    }
}

const MODEL = process.env.MODEL;
const CONFIG =  MONGODB_CONFIG[MODEL];
module.exports = CONFIG;