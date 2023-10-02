const router = require('express').Router();
const { body } = require("express-validator");
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareProduct = require("../middleware/middleware.product");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerCart = require("../controller/controller-cart");

// RENDER TRANG GIỎ HÀNG CỦA NGƯỜI DUNG
router.get("/", MiddlewarePermission.userExists, ControllerCart.renderPageCart);

// KHÁCH HÀNG THÊM SẢN PHẨM VÀO GIỎ HÀNG
router.post('/add', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty'),

],
MiddlewareUser.findUserBySession,
MiddlewareProduct.findProductById,
ControllerCart.addCart);

// KHÁCH HÀNG XOÁ SẢN PHẨM TRONG CART
router.post('/del/product', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty')
],
MiddlewareUser.findUserBySession,
MiddlewareProduct.findProductById,
ControllerCart.removeProductInCart);

// KHÁCH HÀNG HUỶ GIỎ HÀNG
router.post("/cancel", MiddlewarePermission.userExists, MiddlewareUser.findUserBySession, ControllerCart.cancelCart);

module.exports = router;