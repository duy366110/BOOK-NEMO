const router = require('express').Router();
const ControllerAdmin = require("../controller/controller-admin");

router.get("/", ControllerAdmin.renderPageAdmin);
router.get('/product/edit', ControllerAdmin.renderPageEditProduct);
router.get('/product/new', ControllerAdmin.renderPageNewProduct);
router.post('/product/new', ControllerAdmin.saveProduct);

module.exports = router;