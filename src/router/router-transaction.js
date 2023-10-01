const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware.permission");
const ControllerTransaction = require("../controller/controller-transaction");

// ROUTER RENDER LICH SỬ GIAO DỊCH CỦA KHÁCH HÀNG -  SAU KHI LƯU TRẤNCTION THÀNH CÔNG
router.get("/", MiddlewarePermission.userExists ,ControllerTransaction.renderUserHistoryTransaction);

module.exports = router;