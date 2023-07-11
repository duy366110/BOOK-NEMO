const router = require("express").Router();
const ControllerProduct = require("../controller/controller-product");


router.get('/', (req, res, next) => {
    res.status(200).json({status: true, message: 'Router product'});
})

module.exports = router;