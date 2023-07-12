const router = require('express').Router();
const ControllerAdmin = require("../controller/controller-admin");

router.get("/", ControllerAdmin.renderPageAdmin);
router.get('/user', ControllerAdmin.renderPageAdminUser);
router.get('/role', ControllerAdmin.renderPageAdminRole);
router.get('/product/edit', ControllerAdmin.renderPageEditProduct);
router.get('/product/new', ControllerAdmin.renderPageNewProduct);

router.post('/product/new', ControllerAdmin.saveProduct);
router.post('/product/edit', ControllerAdmin.editProduct);

module.exports = router;