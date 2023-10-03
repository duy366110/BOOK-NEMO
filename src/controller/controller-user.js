"use strict"
const { validationResult } = require('express-validator');
const ModelRole = require("../model/model-roles");
const utilpagination = require("../utils/util-pagination");
const ServiceUser = require("../services/service.user");
const environment = require("../../environment");

class ControllerUser {

    constructor() { }

    // RENDER PAGE LIST USER ACCOUNT.
    async renderPageAdminUser(req, res, next) {

        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;
            let { message } = req.flash();

            // CHECK AMOUNT ITEMS IN PAGE
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            let limit = (environment.pagination.user.quantityItemOfPage);
            let skip = (environment.pagination.user.quantityItemOfPage * page);

            await ServiceUser.getUsers(limit, skip, (information) => {
                let { status, message: messageInfor, users, error } = information;

                if(status) {
                    res.render('pages/admin/page-admin-user', {
                        currentPage: Number(page),
                        link: '/user/admin',
                        title: 'Quản trị người dùng',
                        path: 'Quan-tri',
                        infor,
                        message: (message && message.length)? message[0] : '',
                        users,
                        paginations,
                        csurfToken: req.csrfToken(),
                        footer: false
                    });
                }
            })
        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // RENDER PAGE CREATE ACCOUNT.
    async renderNewAccount (req, res, next) {
        try {
            let { infor } = req.session;
            let { message } = req.flash();
            let roles = await ModelRole.find({}).select('name').lean();

            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: [],
                roles,
                formField: {
                    user_name: '',
                    email: '',
                    password: '',
                    password_confirm: '',
                    role: ''
                },
                message: (message && message.length)? message[0] : '',
                footer: false
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }

    }

    // RENDER PAGE EDIT ACCOUNT.
    async renderEditAccount (req, res, next) {
        try {
            let { infor } = req.session;
            let { message } = req.flash();
            let { user } = req;

            let roles = await ModelRole.find({}).select('name').lean();

            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: [],
                roles,
                formField: {
                    id: user._id,
                    user_name: user.name,
                    email: user.email,
                    role: user.role? user.role._id : null,
                },
                message: (message && message.length)? message[0] : '',
                footer: false
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // CREATE ACCOUNT
    async create (req, res, next) {
        let { user_name, email, password, password_confirm, role } = req.body;
        let { errors } = validationResult(req);
        let { infor } = req.session;
        let { roles } = req;

        if(errors.length) {
            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: { user_name, email, password, password_confirm, role },
                message: '',
                footer: false
            })

        } else {
            try {
                let roleInfor = roles.find((roleElm) => roleElm._id.toString() === role);

                await ServiceUser.create({name: user_name, email, password}, roleInfor, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        return res.redirect("/user/admin/0");

                    } else {
                        req.flash('message', 'Tạo mới tài khoản không thành công');
                        return res.redirect("/user/admin/0");
                    }
                })

            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);

            }
        }
    }

    // UPDATE ACCOUNT
    async update (req, res, next) {
        let { user, user_name, email,  role} = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);
        let { roles } = req;

        if(errors.length) {
            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: { user, user_name, email, role },
                message: '',
                footer: false
            })

        } else {
            try {

                let { user, role } = req;
                await ServiceUser.update({model: user, name: user_name, email}, role, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        return res.redirect("/user/admin/0");

                    } else {
                        req.flash('message', 'Cập nhật tài khoản không thành công');
                        return res.redirect("/user/admin/0");
                    }
                })

            } catch (err) {
                let error = Error(err.message);
                error.httpsStatusCode = 500;
                return next(error);
            }
        }

    }

    // DELETE ACCOUNT
    async delete(req, res, next) {
        try {
            let { user } = req;
            await ServiceUser.delete({model: user}, (information) => {
                let { status, message, error } = information;

                if(status) {
                    res.redirect("/user/admin/0");

                } else {
                    req.flash('message', 'Xoá tài khoản không thành công');
                    return res.redirect("/user/admin/0");
                }
            })


        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerUser();