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

            // KIỂM TRA SỐ LƯỢNG TRANG CÓ LỚN HƠN 1
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            let limit = (environment.pagination.user.quantityItemOfPage);
            let skip = (environment.pagination.user.quantityItemOfPage * page);

            await ServiceUser.getUsers(limit, skip, (information) => {
                let { status, message, users, error } = information;

                if(status) {
                    res.render('pages/admin/page-admin-user', {
                        currentPage: Number(page),
                        link: '/user/admin',
                        title: 'Quản trị người dùng',
                        path: 'Quan-tri',
                        infor,
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
            let roles = await ModelRole.find({}).select('name');

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
                    role: user?.role? user.role._id : null,
                },
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
                        let err = new Error(message);
                        err.httpStatusCode = 500;
                        return next(err);
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
                footer: false
            })

        } else {
            try {

                let { user, role } = req;
                await ServiceUser.update({model: user, name: user_name, email}, role, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        res.redirect("/user/admin/0");

                    } else {
                        let err = Error(message);
                        err.httpStatusCode = 500;
                        return next(err);
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
                    let err = new Error(message);
                    err.httpStatusCode = 500;
                    return next(err);
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