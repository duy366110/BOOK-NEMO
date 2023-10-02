"use strict"
const ModelUser = require("../model/model-user");
const UtilBcrypt = require("../utils/util-bcrypt");

class ServiceUser {

    constructor() { }

    // GET PRODUCTS.
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

    // CREATE USER ACCOUNT.
    async create(user = {}, role = {}, cb) {
        try {

            let userInfor = await ModelUser.create({
                name: user.name,
                email: user.email,
                password: UtilBcrypt.hash(user.password),
                role
            });

            if(userInfor) {
                role.users.push(userInfor);
                await role.save();

                cb({status: true, message: 'Create user account successfully'});

            } else {
                cb({status: false, message: 'Create user account unsuccessfully'});
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // UPDATE USER ACCOUNT.
    async update(user = {}, role = {}, cb) {
        try {

            if(user.model.role._id.toString() !== role._id.toString()) {
                user.model.role.users = user.model.role.users.filter((userInRole) => userInRole.toString() !== user.model._id.toString());
                await user.model.role.save();

                role.users.push(user.model);
                await role.save();

                user.model.role = role;
            }

            user.model.name = user.name;
            user.model.email = user.email;
            user.model.updateDate = new Date().toISOString();
            await user.model.save();
            cb({status: true, message: 'Update user account successfully'});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed'});
        }
    }
    
    // DELETE USER ACCOUNT.
    async delete(user = {}, cb) {
        try {
            user.model.role.users = user.model.role.users.filter((userInRole) => userInRole.toString() !== user.model._id.toString());
            await user.model.role.save();
            await user.model.deleteOne();
            cb({status: true, message: 'Delete user account successfully'});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceUser();