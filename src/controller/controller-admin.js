const { validationResult } = require('express-validator');
const ModelProduct = require("../model/model-product");

class ControllerAdmin {

    constructor() { }

    renderPageAdmin = async (req, res, next) => {
        try {
            let products = await ModelProduct.find({});

            res.render('pages/admin/page-admin', {
                title: 'Quản trị sản phẩm',
                path: 'Quan-tri',
                products,
                isUser: req.cookies.user? true : false
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);

        }

    }

    renderPageAdminUser = (req, res, next) => {
        res.render('pages/admin/page-admin-user', {
            title: 'Quản trị người dùng',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false
        });
    }

    renderPageAdminRole = (req, res, next) => {
        res.render('pages/admin/page-admin-role', {
            title: 'Quản trị quyển qaunr trị',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false
        });
    }

    renderPageEditProduct = async (req, res, next) => {
        let { product } = req.query;

        try {
            let productInfor = await ModelProduct.findById(product);

            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                isUser: req.cookies.user? true : false,
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
        res.render("pages/admin/product/page-admin-new-product", {
            title: 'Thêm mới sản phẩm',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false,
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
        const { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/product/page-admin-new-product", {
                title: 'Thêm mới sản phẩm',
                path: 'Quan-tri',
                isUser: req.cookies.user? true : false,
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
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                isUser: req.cookies.user? true : false,
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