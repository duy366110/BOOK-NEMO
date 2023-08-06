const ModelRole = require("../model/model-roles");
const { validationResult } = require('express-validator');

class ControllerRole {

    constructor() { }

    // RENDER TRANG PHÂN QUYỀN TÀI KHOẢN
    renderPageAdminRole = async (req, res, next) => {
        
        try {
            let { infor } = req.session;

            if(infor && infor?.role === 'Admin') {
                let roles = await ModelRole.find({});

                res.render('pages/admin/page-admin-role', {
                    title: 'Quản trị quyển quản trị',
                    path: 'Quan-tri',
                    infor,
                    roles
                });

            } else {
                res.redirect("/user/signin");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // RENDER TRANG THÊM MỚI PHÂN QUYỀN TÀI KHOẢN
    renderPageAdminNewRole = (req, res, next) => {
        let { infor } = req.session;

        if(infor && infor?.role === 'Admin') {
            res.render('pages/admin/role/page-admin-new-role', {
                title: 'Quản trị phân quyền',
                path: 'Quan-tri',
                infor,
                csurfToken: req.csrfToken(),
                inputsErrors: [],
                formField: {
                    role: ''
                }
            })

        } else {
            res.redirect("/user/signin");
        }
    }

    // ADMIN THÊM PHÂN QUYỀN TÀI KHOẢN
    createRole = async (req, res, next) => {
        let { role } = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(infor && infor?.role === 'Admin') {
            if(errors.length) {
                res.render('pages/admin/role/page-admin-new-role', {
                    title: 'Quản trị phân quyền',
                    path: 'Quan-tri',
                    infor,
                    csurfToken: req.csrfToken(),
                    inputsErrors: errors,
                    formField: {
                        role
                    }
                })

            } else {
                try {
                    let roleNew = await ModelRole.create({name: role, users: []});
                    if(roleNew) {
                        res.redirect("/role/admin");
                    }
                
                } catch (err) {
                    let error = Error(err.message);
                    error.httpStatusCode = 500;
                    return next(error);
                }
            }

        } else {
            res.redirect("/user/signin");
        }
    }

}

module.exports = new ControllerRole();