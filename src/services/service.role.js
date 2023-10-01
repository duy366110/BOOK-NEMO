"use strict"
const ModelRole = require("../model/model-roles");

class ServiceRole {

    constructor() { }

    async getRoles(limit, skip, cb) {
        try {
            let roles = await ModelRole.find({}).limit(limit).skip(skip).sort({createDate: 'desc'}).lean();
            cb({status: true, message: 'Get role successfully', roles});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async getById(id, cb) {
        try {
            let role = await ModelRole.findById(id).lean();
            cb({status: true, message: 'Get role successfully', role});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async create(role = {}, cb) {
        try {

            let roleInfor = await ModelRole.create({name: role.name, users: []});
            if(roleInfor) {
                cb({status: true, message: 'Create role successfully'});

            } else {
                cb({status: false, message: 'Create role unsuccessfully'});
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async update(role = {}, cb) {
        try {
            role.model.name = role.name;
            await role.model.save();
            cb({status: true, message: 'Update role successfully'});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async delete(role = {}, cb) {
        try {
            await role.model.deleteOne();
            cb({status: true, message: 'Delete role successfully'});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

}

module.exports = new ServiceRole();