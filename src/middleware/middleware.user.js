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

    async findUserByQueryParams (req, res, next) {
        try {
            let { user } = req.query;
            let userInfor = await ModelUser.findById(user).populate(['role']).exec();
            req.user = userInfor;
            next();

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode =500;
            return next(error);
        }
    }

    async findUserBySession(req, res, next) {
        try {
            let { infor } = req.session;
            if(infor) {
                let user = await ModelUser
                            .findById(infor.id)
                            .populate([
                                'cart.product',
                                {
                                    path: 'order',
                                    populate: {
                                        path: 'collections.product'
                                    }
                                }
                            ])
                            .exec();

                req.user = user;
                next();

            } else {
                res.redirect('/access/signin');
            }

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new MiddlewareUser();