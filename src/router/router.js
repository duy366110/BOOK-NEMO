const router = require('express').Router();
const RouterCommon = require("./router-common");
const RouterCart = require("../router/router-cart");
const RouterUser = require("./router-user");
const RouterOrder = require("./router-order");
const RouterRole = require("./router-role");
const RouterProduct = require("./router-product");
const ControllerException = require("../controller/controller-exception");

router.use('/', RouterCommon);
router.use("/cart", RouterCart);
router.use('/user', RouterUser);
router.use("/order", RouterOrder);
router.use('/product', RouterProduct);
router.use('/role', RouterRole);

router.use(ControllerException.renderinternalServerFailed);
router.use(ControllerException.renderNotFoundPage);


module.exports = router;