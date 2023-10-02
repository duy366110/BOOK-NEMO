const bcryptjs = require("bcryptjs");

class Bcrypt {
    salt = 12;

    constructor() { }

    hash = (password, callback) => {
        return bcryptjs.hashSync(password, this.salt);
    }

    compare = (password, hashPassword, callback) => {
        bcryptjs.compare(password, hashPassword, (err) => {
            if(err) callback(false);
            callback(true);
        })
    }

    generes = (callback) => {
        bcryptjs.genSalt(this.salt, (err, salt) => {
            if(err) callback({status: false, salt: null});
            callback({status: true, salt});
        })
    }
}

module.exports = new Bcrypt();