"use strict"
const ModelUser = require("../model/model-user");

class ServiceUser {

    constructor() { }

    async getUsers(limit, skip, cb) {
        try {
            let users = await ModelUser
            .find({}).limit(limit).skip(skip)
            .sort({createDate: 'desc'})
            .select(['name', 'email', 'role'])
            .populate(['role'])
            .lean();
            
            cb({status: true, message: 'Get users successfully', users});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceUser();