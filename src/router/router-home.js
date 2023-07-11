const router = require('express').Router();
const ControllerHome = require("../controller/controller-home");

router.get('/', ControllerHome.renderPageHome);

module.exports = router;