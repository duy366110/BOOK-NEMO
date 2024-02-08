"use strict"
const environment = require("../../environment");
const utilpagination = require("../utils/util-pagination");
const ServiceProduct = require("../services/service.product");
class ControllerCommon {

    constructor() { }

    //  RENDER HOME PAGE
    async renderPageHome (req, res, next) {
        try {
            let { infor } = req.session;
            await ServiceProduct.getProducts(environment.page.limit, environment.page.skip, (information) => {
                let { status, message, products, error } = information;

                if(status) {
                    res.render('pages/shop/page-home', {
                        title: 'Trang chủ',
                        path: 'Trang-chu',
                        products,
                        infor: infor? infor : null,
                        csurfToken: req.csrfToken(),
                        footer: true
                    });

                } else {
                    let err= new Error(message);
                    er.httpStatusCode = 500;
                    return next(err);
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
            
        }
    }

    // RENDER PRODUCT PAGE
    renderPageProducts = async(req, res, next) => {
        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;   

            // CHECK AMOUNT PAGINATION
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            let limit = environment.pagination.product.quantityItemOfPage;
            let skip = (environment.pagination.product.quantityItemOfPage * page);

            await ServiceProduct.getProducts(limit, skip, (information) => {
                let { status, message, products, error } = information;

                if(status) {
                    res.render('pages/shop/page-product', {
                        currentPage: Number(page),
                        link: '/products',
                        title: 'Sản phẩm',
                        path: 'San-pham',
                        products,
                        infor: infor? infor : null,
                        csurfToken: req.csrfToken(),
                        paginations, 
                        footer: true
                    });

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

    // RENDER PAGE DETAIL PRODUCT
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

    // RENDER INTRODUCTION PAGE
    renderPageIntroduction = async (req, res, next) => {
        try {
            let { infor } = req.session;

            res.render("pages/shop/page-introduction", {
                title: 'Giới thiệu',
                path: 'Gioi-thieu',
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                footer: true
            });

        } catch(error) {
            let err = new Error(error.message);
            err.httpStatusCode = 500;
            return next(err);
        }
    }
}

module.exports = new ControllerCommon();