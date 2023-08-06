const router = require('express').Router();
const RouterHome = require("./router-home");
const RouterAdmin = require("./router-admin");
const RouterCart = require("../router/router-cart");
const RouterUser = require("./router-user");
const RouterOrder = require("./router-order");
const RouterRole = require("./router-role");
const RouterProduct = require("./router-product");
const ControllerException = require("../controller/controller-exception");

router.use('/', RouterHome);
router.use('/admin', RouterAdmin);
router.use("/cart", RouterCart);
router.use('/user', RouterUser);
router.use("/order", RouterOrder);
router.use('/product', RouterProduct);
router.use('/role', RouterRole);

router.use(ControllerException.renderinternalServerFailed);
router.use(ControllerException.renderNotFoundPage);


module.exports = router;