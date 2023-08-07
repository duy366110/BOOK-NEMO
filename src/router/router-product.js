const router = require("express").Router();
const { body } = require('express-validator');
const MiddlewarePermission = require("../middleware/middleware-permission");
const ControllerProduct = require("../controller/controller-product");

// RENDER TRANG QUẢN TRỊ DANH MỤC SẢN PHẨM
router.get("/admin", MiddlewarePermission.permission, ControllerProduct.renderPageAdminProduct);

// RENDER TRANG THÊM MỚI SẢN PHẨM
router.get("/new",MiddlewarePermission.permission, ControllerProduct.renderPageNewProduct);

// RENDER TRANG CẬP NHẬT THÔNG TIN SẢN PHẨM
router.get("/edit", MiddlewarePermission.permission, ControllerProduct.renderPageEditProduct);

// RENDER TRANG CHI TIẾT SẢN PHẨM
router.get("/detail/:product", ControllerProduct.renderPageProductDetail);

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

router.post("/delete", MiddlewarePermission.permission,
[
    body('product').notEmpty().withMessage('Mã sản phẩm không được trống'),

], ControllerProduct.deleteProduct);

module.exports = router;