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
                users
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

    saveProduct = async (req, res, next) => {
        let { title, image, price, description} = req.body;
        let isRole  = req.session.role;
        const { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/product/page-admin-new-product", {
                title: 'Thêm mới sản phẩm',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                csurfToken: req.csrfToken(),
                formError: req.flash('error'),
                inputsErrors: errors,
                formField: { title, image, price, description }
            })

        } else {
            try {
                let product = await ModelProduct.create({title, image, price, description});
                if(product) res.redirect("/");

            } catch (err) {
                let error = new Error('');
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    editProduct = async (req, res, next) => {
        let { product, title, image, price, description } = req.body;
        let isRole  = req.session.role;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                csurfToken: req.csrfToken(),
                formError: req.flash('error'),
                inputsErrors: errors,
                product: { _id: product, title, image, price, description },
            })

        } else {
            try {
                let productInfor = await ModelProduct.findById(product);

                productInfor.title = title;
                productInfor.image = image;
                productInfor.price = price;
                productInfor.description = description;
                let status = await productInfor.save();
                res.redirect('/admin');

            } catch (err) {
                let error = new Error('');
                error.httpStatusCode = 500;
                return next(error);

            }
        }
    }
}

module.exports = new ControllerAdmin();