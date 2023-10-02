"use strict"
const ModelRole = require("../model/model-roles");

class MiddlewareRole {

    constructor() { }
    
    async findRoleById(req, res, next) {
        try {
            let { role } = req.body;
            let roleInfor = await ModelRole.findById(role).exec();
            req.role = roleInfor;
            next();

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    async findRoles(req, res, next) {
        try {
            let roles = await ModelRole.find({}).exec();
            req.roles = roles;
            next();

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new MiddlewareRole();