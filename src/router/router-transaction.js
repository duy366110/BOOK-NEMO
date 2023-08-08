const router = require('express').Router();
const ControllerTransaction = require("../controller/controller-transaction");

// ROUTER RENDER LICH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
router.get("/", ControllerTransaction.renderUserHistoryTransaction);

module.exports = router;