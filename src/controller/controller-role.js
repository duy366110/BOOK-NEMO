"use strict"
const { validationResult } = require('express-validator');
const ModelRole = require("../model/model-roles");
const utilpagination =require("../utils/util-pagination");
const ServiceRole = require("../services/service.role");
const environment = require("../../environment");

class ControllerRole {

    constructor() { }

    // RENDER TRANG PHÂN QUYỀN TÀI KHOẢN
    async renderPageAdminRole(req, res, next) {
        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;

            // KIỂM TRA SỐ LƯỢNG TRANG CÓ LỚN HƠN 1
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            let limit = (environment.pagination.role.quantityItemOfPage);
            let skip = (environment.pagination.role.quantityItemOfPage * page);

            await ServiceRole.getRoles(limit, skip, (information) => {
                let { status, message, roles, error } = information;

                if(status) {
                    return res.render('pages/admin/page-admin-role', {
                        currentPage: Number(page),
                        link: '/role/admin',
                        title: 'Quản trị quyển quản trị',
                        path: 'Quan-tri',
                        csurfToken: req.csrfToken(),
                        pageMessage: null,
                        infor,
                        roles,
                        paginations,
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

    // RENDER TRANG THÊM MỚI PHÂN QUYỀN TÀI KHOẢN
    renderPageAdminNewRole = (req, res, next) => {
        let { infor } = req.session;

        res.render('pages/admin/role/page-admin-new-role', {
            title: 'Quản trị phân quyền',
            path: 'Quan-tri',
            infor,
            csurfToken: req.csrfToken(),
            pageMessage: null,
            inputsErrors: [],
            formField: {
                role: ''
            },
            footer: false
        })
    }

    // RENDER TRANG SỮA THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
    async renderPageAdminEditRole(req, res, next) {
        try {
            let { infor } = req.session;
            let { role } = req.params;

            await ServiceRole.getById(role, (information) => {
                let { status, message, role, error } = information;

                if(status) {
                    return res.render('pages/admin/role/page-admin-edit-role', {
                        title: 'Quản trị phân quyền',
                        path: 'Quan-tri',
                        infor,
                        csurfToken: req.csrfToken(),
                        pageMessage: null,
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

    // ADMIN THÊM PHÂN QUYỀN TÀI KHOẢN
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
                pageMessage: null,
                inputsErrors: errors,
                formField: {
                    role
                },
                footer: false
            })

        } else {
            try {
                await ServiceRole.create({name: role}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
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

    // ADMIN CẬP NHẬT THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
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
                pageMessage: null,
                inputsErrors: errors,
                formField: {
                    role,
                    name
                },
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

    // ADMIN THỰC HIỆN XOÁ TÀI KHOẢN
    async delete(req, res, next) {
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            let roles = await ModelRole.find({});

            res.render('pages/admin/page-admin-role', {
                title: 'Quản trị quyển quản trị',
                path: 'Quan-tri',
                csurfToken: req.csrfToken(),
                pageMessage: errors[0].msg,
                infor,
                roles,
                footer: false
            });

        } else {
            try {
                let { role } = req;
                await ServiceRole.delete({model: role}, (information) => {
                    let { status, message, error} = information;

                    if(status) {
                        res.redirect('/role/admin/0');

                    } else {
                        let error = Error(err.message);
                        error.httpStatusCode = 500;
                        return next(error);
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