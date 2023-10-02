"use strict"
const ModelUser = require("../model/model-user");

class MiddlewareUser {

    constructor() { }

    async findUserById(req, res, next) {
        try {
            let { user } = req.body;
            let userInfor = await ModelUser.findById(user).populate(['role']).exec();
            req.user = userInfor;
            next();

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode =500;
            return next(error);
        }
    }
}

module.exports = new MiddlewareUser();