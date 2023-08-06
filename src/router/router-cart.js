const router = require('express').Router();
const { body } = require("express-validator");
const MiddlewarePermission = require("../middleware/middleware-permission");
const ControllerCart = require("../controller/controller-cart");

// RENDER TRANG GIỎ HÀNG CỦA NGƯỜI DUNG
router.get("/", MiddlewarePermission.userExists, ControllerCart.renderPageCart);

// KHÁCH HÀNG THÊM SẢN PHẨM VÀO GIỎ HÀNG
router.post('/add', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty'),

], ControllerCart.addCart);

// KHÁCH HÀNG XOÁ SẢN PHẨM TRONG CART
router.post('/del/product', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty')
], ControllerCart.deleteProductInCart);

module.exports = router;