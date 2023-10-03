const MONGODB_CONFIG = {
    DEV: {
        URI: process.env.MONGODB_DEV_URL,
    },
    PRO: {
        URI: process.env.MONGODB_PRO_URL,
    }
}

const MODEL = process.env.MODEL;
const CONFIG =  MONGODB_CONFIG[MODEL];
module.exports = CONFIG;