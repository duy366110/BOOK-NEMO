"use strict"
const router = require('express').Router();
const MiddlewareAmount = require("../middleware/middleware.amount");
const ControllerCommon = require("../controller/controller-common");

//RENDER HOME PAGE
router.get('/', ControllerCommon.renderPageHome);

//RENDER LIST PRODUCT PAGE
router.get("/products/:page",
MiddlewareAmount.getProductAmount,
ControllerCommon.renderPageProducts);

//RENDER PRODUCT DETAIL
router.get('/product/detail/:product',
ControllerCommon.renderPageProductDetail);

//RENDER INTRODUCTION PAGE
router.get("/introduction", ControllerCommon.renderPageIntroduction);

module.exports = router;