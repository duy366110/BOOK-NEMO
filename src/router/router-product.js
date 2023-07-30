const router = require("express").Router();
const { body } = require('express-validator');
const ControllerProduct = require("../controller/controller-product");

router.get("/del/:product", ControllerProduct.deleteProduct);


router.post('/new', [
    body('title').custom((value, {req}) => {
        if(!value) throw Error('tên sản phẩm không được trống');
        return true;
    }),

    body('price').custom((value, {req}) => {
        if(!value) throw Error("Giá sản phẩm không được trongó");
        return true;
    }),

    body('description').custom((value, {req}) => {
        if(!value) throw Error('Mô tả sản phẩm không được trống');
        return true;
    })
], ControllerProduct.createProduct);

module.exports = router;