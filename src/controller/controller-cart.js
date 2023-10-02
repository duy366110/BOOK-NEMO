"use strict"
const ModelUser = require("../model/model-user");
const ModelProduct = require("../model/model-product");
const { validationResult } = require("express-validator");
const ServiceCart = require("../services/service.cart");

class ControllerCart {

    constructor() { }
    // KHÁCH HÀNG TRUY CẬP VÀO TRANG GIỎ HÀNG
    renderPageCart = async (req, res, next) => {
        try {
            let { infor } = req.session;

            let userInfor = await ModelUser
            .findOne({email: {$eq: infor.email}})
            .select(['name', 'email', 'cart'])
            .populate('cart.product')
            .exec();

            if(userInfor) {
                // TÍNH TỔNG HOÁ ĐƠN TRƯỚC KHI TRẢ VỀ KHÁCH HÀNG
                let total = Number(userInfor.cart.reduce((acc, cart) => {
                    acc += parseFloat(cart.quantity) * parseFloat(cart.product.price);
                    return acc;
                }, 0)).toFixed(3);

                userInfor.cart = userInfor.cart.map((cart) => {
                    cart.product.price = Number(cart.product.price).toFixed(3);
                    return cart
                })

                res.render("pages/shop/page-cart", {
                    title: 'Giỏ hàng',
                    path: 'Gio-hang',
                    infor: infor? infor : null,
                    csurfToken: req.csrfToken(),
                    formError: req.flash('error'),
                    user: userInfor,
                    total,
                    footer: true
                })
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // USER ADD PRODUCT TO CART
    async addCart(req, res, next) {
        try {
            let { errors } = validationResult(req);

            if(errors.length) {
                throw Error('Product token empty');

            } else {
                let { user, product } = req;

                await ServiceCart.addProductToCart({model: user}, product, (information) => {
                    let { status, message, error} = information;

                    if(status) {
                        return res.redirect("/cart");

                    } else {
                        let err = new Error(message);
                        err.httpStatusCode = 500;
                        return next(err);
                    }
                })
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // USER REMOVE PRODUCT IN CART
    async removeProductInCart (req, res, next) {
        try {
            let { errors } = validationResult(req);

            if(errors.length) {
                throw Error('Product token empty');

            } else {
                let { user, product } = req;
                await ServiceCart.removeProductInCart({model: user}, product, (information) => {
                    let { status, message, error } = information;

                    if(status) {
                        return res.redirect("/cart");

                    } else {
                        let err = new Error(message);
                        err.httpStatusCode = 500;
                        return next(err);
                    }
                })
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // USER CANCEL CART
    async cancelCart(req, res, next) {
        try {
            let { user } = req;

            await ServiceCart.cancelCart({model: user}, (information) => {
                let { status, message, error } = information;

                if(status) {
                    return res.redirect('/cart');

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

module.exports = new ControllerCart();