const router = require('express').Router();
const MiddlewareAmount = require("../middleware/middleware.amount");
const ControllerCommon = require("../controller/controller-common");

//  ROUTER RENDER TRANG CHỦ
router.get('/', ControllerCommon.renderPageHome);

// ROUTER RENDER TRÀN SẢN PHẨM
router.get("/products/:page", MiddlewareAmount.getProductAmount, ControllerCommon.renderPageProducts);

// ROUTER RENDER TRANG GIỚI THIỆU
router.get("/introduction", ControllerCommon.renderPageIntroduction);

module.exports = router;