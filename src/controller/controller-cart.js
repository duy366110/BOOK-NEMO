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

                // TRƯỜNG HỢP NGƯỜI DÙNG TÀI KHOẢN CÓ TỒN TẠI
                if(userInfor) {
                    let productInfor = await ModelProduct.findById(product);

                    // TÀI KHOẢN ĐÃ CÓ CART VÀ SẢN PHẨM
                    if(userInfor.cart.length) {
                        let index = userInfor.cart.findIndex((cart) => cart.product.toString() === product);

                        if(index != -1) {
                            // SẢN PHẨM ĐÃ CÓ TRONG CART TĂNG SỐ LƯỢNG LÊN 1 - CHO MỖI LẦN MUA THÊM
                            userInfor.cart[index].quantity = userInfor.cart[index].quantity + 1;

                        } else {
                            // THÊM SẢN PHẨM KHI SẢN PHẨM CHƯA CÓ TRONG CART
                            productInfor.product_ref = productInfor.product_ref + 1;
                            userInfor.cart.push({
                                product: productInfor,
                                quantity: 1
                            })
                        }

                    } else {
                        // TRƯỜNG HỢP TÀI CHƯA CÓ CART VÀ SẢN PHẨM
                        productInfor.product_ref = productInfor.product_ref + 1;
                        userInfor.cart.push({
                            product: productInfor,
                            quantity: 1
                        })
                    }

                    // LƯU CART NGƯỜI DÙNG
                    await userInfor.save();

                    // XÁC NHẬN SẢN PHẨM CÓ TRONG BAO NHIÊU GIỎ HÀNG VÀ HOÁ ĐƠN
                    await productInfor.save();

                    res.redirect('/cart');

                } else {
                    // TÀI KHOẢN NGƯỜI DÙNG KHÔNG TỒN TẠI
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
                let userInfor = await ModelUser
                                    .findOne({email: {$eq: infor.email}})
                                    .populate("cart.product")
                                    .exec();
                
                let productInfor = userInfor.cart.find((cart) => cart.product._id.toString() === product);
                userInfor.cart = userInfor.cart.filter((cart) => cart.product._id.toString() !== product);

                // XOÁ HIỆN DIỆN CỦA SẢN PHẨM TRONG CÁC GIỎ HÀNG
                if(productInfor) {
                    if(productInfor.product.product_ref > 0) {
                        productInfor.product.product_ref = productInfor.product.product_ref - 1;
                    }
                    await productInfor.product.save();
                }

                await userInfor.save();
                res.redirect("/cart");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG HUỶ CART
    cartCancel = async (req, res, next) => {
        try {
            let { infor } = req.session;
            let { user } = req.body;

            let userInfor = await ModelUser.findById(user).populate(['cart.product']).exec();
            let productsInfor = userInfor.cart;

            for(let cart of productsInfor) {
                if(cart.product.product_ref > 0) {
                    cart.product.product_ref = cart.product.product_ref - 1;
                    await cart.product.save();
                }
            }

            userInfor.cart = [];
            await userInfor.save();
            res.redirect("/cart");

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerCart();