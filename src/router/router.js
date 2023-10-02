const router = require('express').Router();
const RouterCommon = require("./router-common");
const RouterAccess = require("./router-access");
const RouterCart = require("../router/router-cart");
const RouterUser = require("./router-user");
const RouterOrder = require("./router-order");
const RouterRole = require("./router-role");
const RouterProduct = require("./router-product");
const RouterTransaction = require("./router-transaction");
const ControllerException = require("../controller/controller-exception");

router.use('/', RouterCommon);
router.use("/access", RouterAccess);
router.use("/cart", RouterCart);
router.use('/user', RouterUser);
router.use("/order", RouterOrder);
router.use('/product', RouterProduct);
router.use('/role', RouterRole);
router.use("/transaction", RouterTransaction);

router.use(ControllerException.renderinternalServerFailed);
router.use(ControllerException.renderNotFoundPage);


module.exports = router;