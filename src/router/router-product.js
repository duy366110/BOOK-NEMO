const router = require("express").Router();
const ControllerProduct = require("../controller/controller-product");

router.get("/del/:product", ControllerProduct.deleteProduct);

module.exports = router;