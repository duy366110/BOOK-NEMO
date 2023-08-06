const { validationResult } = require('express-validator');
const ModelProduct = require("../model/model-product");
const ModelRole = require("../model/model-roles");
const ModelUser = require('../model/model-user');

class ControllerAdmin {

    constructor() { }

    // RENDER TRANG QUẢN LÝ SẢN PHẨM
    renderPageAdmin = async (req, res, next) => {

        try {
            let { infor } = req.session;
            let products = await ModelProduct.find({});

            if(infor && infor?.role === 'Admin') {
                res.render('pages/admin/page-admin', {
                    title: 'Quản trị sản phẩm',
                    path: 'Quan-tri',
                    products,
                    infor
                });

            } else {
                res.redirect('/user/signin');
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }


    // RENDER TRANG QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
    renderPageAdminUser = async (req, res, next) => {

        try {
            let { infor } = req.session;
            let users = await ModelUser.find({}).select(['name', 'email', 'role']).populate('role');

            if(infor && infor?.role === 'Admin') {
                res.render('pages/admin/page-admin-user', {
                    title: 'Quản trị người dùng',
                    path: 'Quan-tri',
                    infor,
                    users,
                    csurfToken: req.csrfToken()
                });

            } else {
                res.redirect('/user/signin');

            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);

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