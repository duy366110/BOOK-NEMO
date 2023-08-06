const ModelUser = require("../model/model-user");
const ModelProduct = require("../model/model-product");
const { validationResult } = require("express-validator");

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
                let total = userInfor.cart.reduce((acc, cart) => {
                    acc += parseFloat(cart.quantity) * parseFloat(cart.product.price);
                    return acc;
                }, 0)

                res.render("pages/shop/page-cart", {
                    title: 'Giỏ hàng',
                    path: 'Gio-hang',
                    infor: infor? infor : null,
                    csurfToken: req.csrfToken(),
                    formError: req.flash('error'),
                    user: userInfor,
                    total,
                })
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG THÊM SẢN PHẨM VÀO GIỎ HÀNG
    addCart = async (req, res, next) => {
        try {
            let { product} = req.body;
            let { infor } = req.session;
            let { errors } = validationResult(req);

            if(errors.length) {
                throw Error('Product token empty');

            } else {
                let userInfor = await ModelUser.findOne({email: {$eq: infor.email}});

                if(userInfor) {
                    let productInfor = await ModelProduct.findById(product);

                    if(userInfor.cart.length) {
                        let index = userInfor.cart.findIndex((cart) => cart.product.toString() === product);

                        if(index != -1) {
                            userInfor.cart[index].quantity = userInfor.cart[index].quantity + 1;

                        } else {
                            userInfor.cart.push({
                                product: productInfor,
                                quantity: 1
                            })
                        }

                    } else {
                        userInfor.cart.push({
                            product: productInfor,
                            quantity: 1
                        })
                    }

                    await userInfor.save();
                    res.redirect('/cart');

                } else {
                    res.redirect('/cart');
                }
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG XOÁ SẢN PHẨM TRONG CART
    deleteProductInCart = async (req, res, next) => {
        try {
            let { product } = req.body;
            let { infor } = req.session;
            let { errors } = validationResult(req);

            if(errors.length) {
                throw Error('Product token empty');

            } else {
                let userInfor = await ModelUser.findOne({email: {$eq: infor.email}});
                userInfor.cart = userInfor.cart.filter((cart) => cart.product.toString() !== product);
                await userInfor.save();
                res.redirect("/cart");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerCart();