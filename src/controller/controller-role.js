const ModelRole = require("../model/model-roles");
const mongdb = require('mongodb');
const { validationResult } = require('express-validator');
const ObjectId = mongdb.ObjectId;

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
                    csurfToken: req.csrfToken(),
                    pageMessage: null,
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
                pageMessage: null,
                inputsErrors: [],
                formField: {
                    role: ''
                }
            })

        } else {
            res.redirect("/user/signin");
        }
    }

    // RENDER TRANG SỮA THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
    renderPageAdminEditRole = async(req, res, next) => {
        let { infor } = req.session;
        let { role } = req.params;

        if(infor && infor?.role === 'Admin') {
            try {
                let roleInfor = await ModelRole.findById(role);

                res.render('pages/admin/role/page-admin-edit-role', {
                    title: 'Quản trị phân quyền',
                    path: 'Quan-tri',
                    infor,
                    csurfToken: req.csrfToken(),
                    pageMessage: null,
                    inputsErrors: [],
                    formField: {
                        id: roleInfor? roleInfor._id : '',
                        role: roleInfor? roleInfor.name : ''
                    }
                })

            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }

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
                    pageMessage: null,
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

    // ADMIN CẬP NHẬT THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
    modifiRole = async (req, res, next) => {
        let { role, id } = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(infor && infor?.role === 'Admin') {
            if(errors.length) {
                res.render('pages/admin/role/page-admin-edit-role', {
                    title: 'Quản trị phân quyền',
                    path: 'Quan-tri',
                    infor,
                    csurfToken: req.csrfToken(),
                    pageMessage: null,
                    inputsErrors: errors,
                    formField: {
                        id,
                        role
                    }
                })

            } else {
                try {
                    let roleInfor = await ModelRole.findById(id);
                    roleInfor.name = role;

                    await roleInfor.save();
                    res.redirect("/role/admin");
                
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

    // ADMIN THỰC HIỆN XOÁ TÀI KHOẢN
    deleteRole = async(req, res, next) => {
        let { infor } = req.session;
        let { role } = req.body;
        let { errors } = validationResult(req);

        if(infor && infor?.role === "Admin") {
            if(errors.length) {
                let roles = await ModelRole.find({});

                res.render('pages/admin/page-admin-role', {
                    title: 'Quản trị quyển quản trị',
                    path: 'Quan-tri',
                    csurfToken: req.csrfToken(),
                    pageMessage: errors[0].msg,
                    infor,
                    roles
                });

            } else {
                try {
                    await ModelRole.deleteOne({_id: {$eq: new ObjectId(role)}});
                    res.redirect('/role/admin');

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