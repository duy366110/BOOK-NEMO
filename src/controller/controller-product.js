const ModelProduct = require("../model/model-product");
const cloudinary = require("../utils/util-cloudinary");
const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator");
class ControllerProduct {

    constructor() { }

    // RENDER TRANG QUẢN LÝ SẢN PHẨM
    renderPageAdminProduct = async (req, res, next) => {
        try {
            let { infor } = req.session;

            let products = await ModelProduct.find({});
            res.render('pages/admin/page-admin', {
                title: 'Quản trị sản phẩm',
                path: 'Quan-tri',
                infor,
                products,
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // RENDER TRANG THÊM MỚI SẢN PHẨM
    renderPageNewProduct = (req, res, next) => {
        let { infor } = req.session;

        res.render("pages/admin/product/page-admin-new-product", {
            title: 'Thêm mới sản phẩm',
            path: 'Quan-tri',
            infor: infor? infor : null,
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

    // RENDER TRANG CẬP NHẬT THÔNG TIN SẢN PHẨM
    renderPageEditProduct = async (req, res, next) => {
        let { product } = req.query;
        let { infor } = req.session;

        try {
            let productInfor = await ModelProduct.findById(product);

            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                infor: infor? infor : null,
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

    // ADMIN CREATE SẢN PHẨM
    createProduct = async (req, res, next) => {
        let { title, price, description} = req.body;
        let { file } = req;
        let { infor } = req.session;
        const { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/product/page-admin-new-product", {
                title: 'Thêm mới sản phẩm',
                path: 'Quan-tri',
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                formError: req.flash('error'),
                inputsErrors: errors,
                formField: { title, image, price, description }
            })

        } else {
            try {
                let pathImage = '';
                if(file) {
                    pathImage = file.path? file.path : '';
                }

                let product = await ModelProduct.create({title, image: pathImage, price, description});
                if(product) res.redirect("/");

            } catch (err) {
                let error = new Error('');
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // ADIM CAP NHAT THONG TIN SAN PHAM
    updateProduct = async (req, res, next) => {
        try {
            let { product, title, image, price, description} = req.body;
            let { file } = req;
            let { errors } = validationResult(req);
            let { infor } = req.session;

            if(errors.length) {
                res.render('pages/admin/product/page-admin-edit-product', {
                    title: 'Chỉnh sửa thông tin sản phẩm',
                    path: 'Quan-tri',
                    infor: infor? infor : null,
                    csurfToken: req.csrfToken(),
                    formError: req.flash('error'),
                    inputsErrors: errors,
                    product: { _id: product, title, image, price, description },
                })

            } else {
                let productInfor = await ModelProduct.findById(product);
                productInfor.title = title;
                productInfor.price = price;
                productInfor.description = description;

                if(file) {
                    let imagePath = productInfor.image.split("/");
                    let image = imagePath[(imagePath.length - 1)].split(".")[0];

                    // THUC HIEN KIEM TRA XEM FILE CO TON TAI TREN CLOUD
                    let checkImage = await cloudinary.exists(`book_nemo/${image}`);

                    if(checkImage.status) {
                        // XOA FILE CU CAP NHAT FILE MOI
                        let { status } = await cloudinary.destroy(`book_nemo/${image}`);

                        if(status) {
                            productInfor.image = file.path;
                        }

                    } else {
                        // FILE KHONG TON TAI TIEN HANH CAP NHAT
                        productInfor.image = file.path;
                    }
                }
                
                await productInfor.save();
                res.redirect("/admin");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }

    }

    // ADMIN XOÁ SẢN PHẨM
    deleteProduct = async (req, res, next) => {
        try {
            let { product } = req.params;

            let productInfor = await ModelProduct.findById(product);
            let imagePath = productInfor.image.split("/");
            let image = imagePath[(imagePath.length - 1)].split(".")[0];

            // XOÁ ẢNH SẢN PHẨM TRƯỚC KHI XOÁ SẢN PHẨM
            let { status } = await cloudinary.destroy(`book_nemo/${image}`);

            // XOÁ ẢNH SẢN PHẨM THÀNH CÔNG - XOA SẢN PHẨM
            if(status) {
                await productInfor.deleteOne();
                res.redirect("/admin");
            }


        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerProduct();