const router = require('express').Router();
const { body } = require('express-validator');
const ControllerAdmin = require("../controller/controller-admin");

router.get("/", ControllerAdmin.renderPageAdmin);
router.get('/user', ControllerAdmin.renderPageAdminUser);
router.get('/role', ControllerAdmin.renderPageAdminRole);
router.get('/product/edit', ControllerAdmin.renderPageEditProduct);
router.get('/product/new', ControllerAdmin.renderPageNewProduct);

router.post('/product/new', [
    body('title').custom((value, {req}) => {
        if(!value) throw Error('tên sản phẩm không được trống');
        return true;
    }),

    body('image').custom((value, {req}) => {
        if(!value) throw Error('Ảnh sản phẩm không được trống');
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
], ControllerAdmin.saveProduct);

router.post('/product/edit',[
    body('title').custom((value, {req}) => {
        if(!value) throw Error('tên sản phẩm không được trống');
        return true;
    }),
    
    body('image').custom((value, {req}) => {
        if(!value) throw Error('Ảnh sản phẩm không được trống');
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
], ControllerAdmin.editProduct);

module.exports = router;