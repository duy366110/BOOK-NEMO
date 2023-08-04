const router = require('express').Router();
const ControllerOrder = require("../controller/controller-order");

// RENDER TRANG ĐƠN HÀNG CỦA KHÁCH HÀNG
router.get('/', ControllerOrder.renderPageOrder);

// KHÁCH HÀNG THÊM GIỎ HÀNG VÀO THANH TOÁN
router.post('/add', ControllerOrder.addOrder);

module.exports = router;