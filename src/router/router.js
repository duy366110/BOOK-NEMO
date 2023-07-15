const router = require('express').Router();
const RouterHome = require("./router-home");
const RouterAdmin = require("./router-admin");
const RouterUser = require("./router-user");
const RouterProduct = require("./router-product");
const RouterOrder = require("./router-order");
const ControllerException = require("../controller/controller-exception");

router.use('/', RouterHome);
router.use('/admin', RouterAdmin);
router.use('/user', RouterUser);
router.use('/product', RouterProduct);
router.use("/order", RouterOrder);

router.use(ControllerException.renderinternalServerFailed);
router.use(ControllerException.renderNotFoundPage);


module.exports = router;