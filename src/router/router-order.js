"use strict"
const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerOrder = require("../controller/controller-order");

// RENDER PAGE ORDER OF USER
router.get('/', MiddlewarePermission.userExists, ControllerOrder.renderPageOrder);

// KHÁCH HÀNG RENDER HOÁ ĐƠN
router.get("/invoice/:user", MiddlewarePermission.userExists, ControllerOrder.renderInvoice);

// USER ORDER
router.post('/',
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerOrder.order);

// KHÁCH HÀNG HUỶ ĐƠN HÀNG
router.post('/cancel', MiddlewarePermission.userExists, ControllerOrder.orderCancel);

// KHÁCH HÀNG THỰC HIỆN THANH TOÁN HOÁ ĐƠN
router.post('/payment', MiddlewarePermission.userExists, ControllerOrder.orderPayment);

module.exports = router;