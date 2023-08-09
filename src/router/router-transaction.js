const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware-permission");
const ControllerTransaction = require("../controller/controller-transaction");

// ROUTER RENDER LICH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
router.get("/", MiddlewarePermission.userExists ,ControllerTransaction.renderUserHistoryTransaction);

// ROUTER LƯU GIA DỊCH SAU KHI KHÁCH HÀNG ĐI PAYMENT THÀNH CÔNG
// router.get("/save-payment", ControllerTransaction.createTransaction);

module.exports = router;