const router = require('express').Router();
const { body } = require("express-validator");
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareProduct = require("../middleware/middleware.product");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerCart = require("../controller/controller-cart");

// RENDER USER CART
router.get("/",
MiddlewarePermission.userExists,
ControllerCart.renderPageCart);

// USER ADD PRODUCT TO CART
router.post('/add', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty'),
],
MiddlewareUser.findUserBySession,
MiddlewareProduct.findProductById,
ControllerCart.addCart);

// USER REMOVE PRODUCT TO CART
router.post('/del/product', MiddlewarePermission.userExists,
[
    body('product').notEmpty().withMessage('Product token not empty')
],
MiddlewareUser.findUserBySession,
MiddlewareProduct.findProductById,
ControllerCart.removeProductInCart);

// USER CANCEL CART
router.post("/cancel",
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerCart.cancelCart);

module.exports = router;