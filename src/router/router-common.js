const router = require('express').Router();
const ControllerCommon = require("../controller/controller-common");

//  ROUTER RENDER TRANG CHỦ
router.get('/', ControllerCommon.renderPageHome);

// ROUTER RENDER TRANG GIỚI THIỆU
router.get("/introduction", ControllerCommon.renderPageIntroduction);

module.exports = router;