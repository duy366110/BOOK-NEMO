const router = require('express').Router();
const ControllerOrder = require("../controller/controller-order");

router.get('/', (req, res, next) => {
    res.status(200).json({status: true, message: 'Router order'});
})

module.exports = router;