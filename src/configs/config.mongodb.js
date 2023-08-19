const MONGODB_CONFIG = {
    DEV: {
        URI: process.env.DEV_URI,
    },
    PRO: {
        URI: process.env.PRO_URI,
    }
}

const MODEL = process.env.MODEL;
const CONFIG =  MONGODB_CONFIG[MODEL];
module.exports = CONFIG;