const router = require("express").Router();
const ControllerProduct = require("../controller/controller-product");


router.get('/new-product', ControllerProduct.renderPageNewProduct);
router.post('/new-product', ControllerProduct.saveProduct);

module.exports = router;