"use strict"
const { validationResult } = require('express-validator');
const ModelRole = require("../model/model-roles");
const utilpagination =require("../utils/util-pagination");
const ServiceRole = require("../services/service.role");
const environment = require("../../environment");

class ControllerRole {

    constructor() { }

    // RENDER PAGE ROLE
    async renderPageAdminRole(req, res, next) {
        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;
            let { message } = req.flash();

            // CHECK AMOUNT ITEMS IN PAGE
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            let limit = (environment.pagination.role.quantityItemOfPage);
            let skip = (environment.pagination.role.quantityItemOfPage * page);

            await ServiceRole.getRoles(limit, skip, (information) => {
                let { status, message: messageInfor, roles, error } = information;

                return res.render('pages/admin/page-admin-role', {
                    currentPage: Number(page),
                    link: '/role/admin',
                    title: 'Quản trị quyển quản trị',
                    path: 'Quan-tri',
                    csurfToken: req.csrfToken(),
                    message: (message && message.length)? message[0] : '',
                    infor,
                    roles,
                    paginations,
                    footer: false
                });
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // RENDER PAGE NEW ROLE
    renderPageAdminNewRole = (req, res, next) => {
        let { infor } = req.session;
        let { message } = req.flash();

        res.render('pages/admin/role/page-admin-new-role', {
            title: 'Quản trị phân quyền',
            path: 'Quan-tri',
            infor,
            csurfToken: req.csrfToken(),
            message: (message && message.length)? message[0] : '',
            inputsErrors: [],
            formField: {
                role: ''
            },
            footer: false
        })
    }

    // RENDER PAGE UPDATE ROLE
    async renderPageAdminEditRole(req, res, next) {
        try {
            let { infor } = req.session;
            let { role } = req.params;
            let { message } = req.flash();

            await ServiceRole.getById(role, (information) => {
                let { status, message: messageInfor, role, error } = information;

                if(status) {
                    return res.render('pages/admin/role/page-admin-edit-role', {
                        title: 'Quản trị phân quyền',
                        path: 'Quan-tri',
                        infor,
                        csurfToken: req.csrfToken(),
                        message: (message && message.length)? message[0] : '',
                        inputsErrors: [],
                        formField: {
                            role: role? role._id : '',
                            name: role? role.name : ''
                        },
                        footer: false
                    })
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // METHOD CREATE ROLE
    async create(req, res, next) {
        let { role } = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render('pages/admin/role/page-admin-new-role', {
                title: 'Quản trị phân quyền',
                path: 'Quan-tri',
                infor,
                csurfToken: req.csrfToken(),
                message: '',
                inputsErrors: errors,
                formField: { role },
                footer: false
            })

        } else {
            try {
                await ServiceRole.create({name: role}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.redirect("/role/admin/0");

                    } else {
                        req.flash('message', 'Tạo mới role không thành công');
                        res.redirect("/role/admin/0");
                    }
                })
            
            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // METHDO UPDATE ROLE
    async update(req, res, next) {
        let { name, role } = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render('pages/admin/role/page-admin-edit-role', {
                title: 'Quản trị phân quyền',
                path: 'Quan-tri',
                infor,
                csurfToken: req.csrfToken(),
                message: '',
                inputsErrors: errors,
                formField: { role, name },
                footer: false
            })

        } else {
            try {
                let { role } = req;
                await ServiceRole.update({model: role, name}, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        res.redirect("/role/admin/0");

                    } else {
                        req.flash('message', 'Cập nhật role không thành công');
                        res.redirect("/role/admin/0");
                    }
                })
            
            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // METHDO DELETE ROLE
    async delete(req, res, next) {
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            req.flash('message', errors[0].msg);
            res.redirect('/role/admin/0');

        } else {
            try {
                let { role } = req;
                await ServiceRole.delete({model: role}, (information) => {
                    let { status, message, error} = information;

                    if(status) {
                        res.redirect('/role/admin/0');

                    } else {
                        req.flash('message', 'Xoá role không thành công');
                        res.redirect("/role/admin/0");
                    }
                })

            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

}

module.exports = new ControllerRole();