"use strict"
const { validationResult } = require("express-validator");
const utilpagination = require("../utils/util-pagination");
const environment = require("../../environment");

const ServiceProduct = require("../services/service.product");
class ControllerProduct {

    constructor() { }

    // RENDER TRANG QUẢN LÝ SẢN PHẨM
    async renderPageAdminProduct(req, res, next) {
        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;   

            // KIỂM TRA SỐ LƯỢNG TRANG CÓ LỚN HƠN 1
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            await ServiceProduct.getProducts(environment.pagination.product.quantityItemOfPage, (environment.pagination.quantityItemOfPage * page), (information) => {
                 let { status, message, products, error } = information;

                 if(status) {
                    res.render('pages/admin/page-admin', {
                        currentPage: Number(page),
                        link: '/product/admin',
                        title: 'Quản trị sản phẩm',
                        path: 'Quan-tri',
                        csurfToken: req.csrfToken(),
                        infor,
                        products,
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

    // RENDER TRÀN CHI TIẾT SẢN PHẨM
    async renderPageProductDetail(req, res, next) {
        try {
            let { infor } = req.session;
            let { product } = req.params;

            await ServiceProduct.getById(product, (information) => {
                let { status, message, product, error } = information;

                if(status) {
                    res.render('pages/shop/page-product-detail', {
                        title: 'Chi tiết sản phẩm',
                        path: 'Chi-tiet-san-pham',
                        csurfToken: req.csrfToken(),
                        infor,
                        product,               
                        footer: true
                    });
                }
            })

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
            },
            footer: false
        })
    }

    // RENDER TRANG CẬP NHẬT THÔNG TIN SẢN PHẨM
    renderPageEditProduct = async (req, res, next) => {
        try {
            let { infor } = req.session;
            let { product } = req.query;

            await ServiceProduct.getById(product, (information) => {
                let { status, message, product, error } = information;
                if(status) {
                    res.render('pages/admin/product/page-admin-edit-product', {
                        title: 'Chỉnh sửa thông tin sản phẩm',
                        path: 'Quan-tri',
                        infor: infor? infor : null,
                        csurfToken: req.csrfToken(),
                        formError: req.flash('error'),
                        inputsErrors: [],
                        product,
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

    // ADMIN CREATE SẢN PHẨM
    async createProduct(req, res, next) {
        let { title, price, quantity, description} = req.body;
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
                formField: { title, image, price, quantity, description },
                footer: false
            })

        } else {
            try {
                
                let product = {
                    title,
                    image: file.path? file.path : '',
                    price: Number(price).toFixed(3),
                    quantity,
                    description
                }

                await ServiceProduct.create(product, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        res.redirect("/product/admin/0");

                    } else {
                        res.render("pages/admin/product/page-admin-new-product", {
                            title: 'Thêm mới sản phẩm',
                            path: 'Quan-tri',
                            infor: infor? infor : null,
                            csurfToken: req.csrfToken(),
                            formError: req.flash('error'),
                            inputsErrors: errors,
                            formField: { title, image, price, quantity, description },
                            footer: false
                        })
                    }
                })

            } catch (err) {
                let error = new Error('');
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // ADIM CAP NHAT THONG TIN SAN PHAM
    async update(req, res, next) {
        try {
            let { product, title, image, price, quantity, description} = req.body;
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
                    footer: false
                })

            } else {
                let { file } = req;
                let { product } = req;

                let productInfor = {
                    model: product,
                    title,
                    image: file.path? file.path : '',
                    price: Number(price).toFixed(3),
                    quantity,
                    description
                }

                await ServiceProduct.update(productInfor, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.redirect("/product/admin/0");
                    }
                })
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }

    }

    // ADMIN XOÁ SẢN PHẨM
    async delete (req, res, next) {
        try {
            let { product } = req;

            if(!product.ref) {
                await ServiceProduct.delete({model: product}, (information) => {
                    let { status, message } = information;
                    if(status) {
                        res.redirect("/product/admin/0");
                    }
                })
            }

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerProduct();