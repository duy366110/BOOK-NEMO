"use strict"
const ModelUser  = require("../model/model-user");
const UtilBcrypt = require("../utils/util-bcrypt");

class ServiceAccess {

    constructor() { }

    verifyUserAccount(user = {}, cb) {
        let status = UtilBcrypt.compare(user.password, user.model.password);

        if(status) {
            cb({status: true, message: 'Password correct', user: user.model});
            
        } else {
            cb({status: false, message: 'Password incorrect'});
        }
    }
}

module.exports = new ServiceAccess();