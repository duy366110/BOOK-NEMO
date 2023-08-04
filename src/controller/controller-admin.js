const { validationResult } = require('express-validator');
const ModelProduct = require("../model/model-product");
const ModelRole = require("../model/model-roles");
const ModelUser = require('../model/model-user');

class ControllerAdmin {

    constructor() { }

    renderPageAdmin = async (req, res, next) => {

        try {
            let isRole  = req.session.role;
            let products = await ModelProduct.find({});

            if(isRole !== 'Admin') {
                res.redirect('/');

            } else {
                res.render('pages/admin/page-admin', {
                    title: 'Quản trị sản phẩm',
                    path: 'Quan-tri',
                    products,
                    isLogin: req.cookies.user? true : false,
                    isRole:  isRole? isRole : 'Client'
                });
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);

        }

    }


    // NGƯỜI DÙNG

    renderPageAdminUser = async (req, res, next) => {

        try {
            let isRole  = req.session.role;
            let users = await ModelUser.find({}).select(['name', 'email', 'role']).populate('role');

            res.render('pages/admin/page-admin-user', {
                title: 'Quản trị người dùng',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                users,
                csurfToken: req.csrfToken()
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);

        }
    }

    // PHÂN QUYỀN
    renderPageAdminRole = async (req, res, next) => {
        
        try {
            let isRole  = req.session.role;
            let roles = await ModelRole.find({});

            res.render('pages/admin/page-admin-role', {
                title: 'Quản trị quyển quản trị',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                roles
            });


        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    renderPageNewRole = (req, res, next) => {
        let isRole  = req.session.role;

        res.render('pages/admin/role/page-admin-new-role', {
            title: 'Quản trị phân quyền',
            path: 'Quan-tri',
            isLogin: req.cookies.user? true : false,
            isRole:  isRole? isRole : 'Client',
            csurfToken: req.csrfToken(),
            inputsErrors: [],
            formField: {
                role: ''
            }
        })
    }

    saveRole = async (req, res, next) => {
        let { role } = req.body;
        let isRole  = req.session.role;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render('pages/admin/role/page-admin-new-role', {
                title: 'Quản trị phân quyền',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
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
                    res.redirect("/admin/role");
                }
            
            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
            
            
        }
    }

    // SẢN PHẨM
    renderPageEditProduct = async (req, res, next) => {
        let { product } = req.query;
        let isRole  = req.session.role;

        try {
            let productInfor = await ModelProduct.findById(product);

            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                csurfToken: req.csrfToken(),
                formError: req.flash('error'),
                inputsErrors: [],
                product: productInfor? productInfor : null,
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    renderPageNewProduct = (req, res, next) => {
        let isRole  = req.session.role;

        res.render("pages/admin/product/page-admin-new-product", {
            title: 'Thêm mới sản phẩm',
            path: 'Quan-tri',
            isLogin: req.cookies.user? true : false,
            isRole:  isRole? isRole : 'Client',
            csurfToken: req.csrfToken(),
            formError: req.flash('error'),
            inputsErrors: [],
            formField: {
                title: '',
                image: '',
                price: '',
                description: ''
            }
        })
    }
}

module.exports = new ControllerAdmin();