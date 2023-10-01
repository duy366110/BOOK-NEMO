const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware.permission");
const ControllerOrder = require("../controller/controller-order");

// RENDER TRANG ĐƠN HÀNG CỦA KHÁCH HÀNG
router.get('/', MiddlewarePermission.userExists, ControllerOrder.renderPageOrder);

// KHÁCH HÀNG RENDER HOÁ ĐƠN
router.get("/invoice/:user", MiddlewarePermission.userExists, ControllerOrder.renderInvoice);

// KHÁCH HÀNG THÊM GIỎ HÀNG VÀO THANH TOÁN
router.post('/add', MiddlewarePermission.userExists, ControllerOrder.addOrder);

// KHÁCH HÀNG HUỶ ĐƠN HÀNG
router.post('/cancel', MiddlewarePermission.userExists, ControllerOrder.orderCancel);

// KHÁCH HÀNG THỰC HIỆN THANH TOÁN HOÁ ĐƠN
router.post('/payment', MiddlewarePermission.userExists, ControllerOrder.orderPayment);

module.exports = router;