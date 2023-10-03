"use strict"
const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerOrder = require("../controller/controller-order");

// RENDER PAGE ORDER OF USER
router.get('/',
MiddlewarePermission.userExists,
ControllerOrder.renderPageOrder);

// KHÁCH HÀNG RENDER HOÁ ĐƠN
router.get("/invoice",
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerOrder.renderInvoice);

// USER ORDER
router.post('/',
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerOrder.order);

// USER CANCEL ORDER
router.post('/cancel',
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerOrder.cancelOrder);

// USER PAYMENT
router.post('/payment',
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerOrder.payment);

module.exports = router;