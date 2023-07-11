const router = require('express').Router();
const RouterUser = require("./router-user");
const RouterProduct = require("./router-product");
const routerOrder = require("./router-order");


router.use('/user', RouterUser);
router.use('/product', RouterProduct);
router.use("/order", routerOrder);

module.exports = router;