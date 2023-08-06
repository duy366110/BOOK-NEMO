const router = require("express").Router();
const { body } = require('express-validator');
const MiddlewarePermission = require("../middleware/middleware-permission");
const ControllerProduct = require("../controller/controller-product");

// RENDER TRANG QUẢN TRỊ DANH MỤC SẢN PHẨM
router.get("/admin", MiddlewarePermission.permission, ControllerProduct.renderPageAdminProduct);

// RENDER TRANG THÊM MỚI SẢN PHẨM
router.get("/new",MiddlewarePermission.permission, ControllerProduct.renderPageNewProduct);

// ADMIN THEM MOI PRODUCT
router.post('/new', MiddlewarePermission.permission, [
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

// ADMIN CHINH SAN THONG TIN SAN PHAM
router.post('/edit', MiddlewarePermission.permission, [
    body('title').custom((value, {req}) => {
        if(!value) throw Error('tên sản phẩm không được trống');
        return true;
    }),

    body('price').custom((value, {req}) => {
        if(!value) throw Error("Giá sản phẩm không được trống");
        return true;
    }),

    body('description').custom((value, {req}) => {
        if(!value) throw Error('Mô tả sản phẩm không được trống');
        return true;
    })
], ControllerProduct.updateProduct);

router.get("/del/:product", MiddlewarePermission.permission, ControllerProduct.deleteProduct);

module.exports = router;