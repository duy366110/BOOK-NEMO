const router = require('express').Router();
const RouterHome = require("./router-home");
const RouterAdmin = require("./router-admin");
const RouterUser = require("./router-user");
const RouterProduct = require("./router-product");
const RouterOrder = require("./router-order");
const RouterRole = require("./router-role");

router.use('/', RouterHome);
router.use('/admin', RouterAdmin);
router.use('/user', RouterUser);
router.use('/product', RouterProduct);
router.use("/order", RouterOrder);
router.use("/role", RouterRole);

module.exports = router;