const router = require('express').Router();
const mongodb = require('mongodb');
const { body } = require('express-validator');
const ModelRole = require("../model/model-roles");
const ControllerRole = require("../controller/controller-role");
const ObjectId = mongodb.ObjectId;

// HIỂN THỊ TRANG DANH SÁCH QUYỀN TÀI KHOẢN
router.get("/admin", ControllerRole.renderPageAdminRole);

// HIỂN THỊ TRANG THÊM MỚI QUYỀN TÀI KHOẢN
router.get("/admin/new", ControllerRole.renderPageAdminNewRole);

// HIỂN THỊ TRANG SỮA THÔNG TIN QUYỀN TÀI KHOẢN
router.get("/admin/edit/:role", ControllerRole.renderPageAdminEditRole);

// THÊM MỚI PHÂN QUYỀN TÀI KHOẢN
router.post("/new", [
    body('role').custom(async (val, {req}) => {
        if(!val.trim()) throw Error('Quyền tài khoản không được trống');
        if(val) {
            let roleInfor = await ModelRole.findOne({name: {$eq: val}});

            if(roleInfor) {
                throw Error('Quyền tài khoản đã tồn tại');
            }
        }

        return true;
    }),

], ControllerRole.createRole);

// CẬP NHẬT THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
router.post("/edit", [
    body('id').notEmpty().withMessage('Token quyền tài khoản không được trống'),
    body('role').custom( async(val, {req}) => {
        if(!val.trim()) throw Error('Quyền tài khoản không được trống');

        if(val) {
            let roleInfor = await ModelRole.findById(req.body.id);
            let roleNameInfor = await ModelRole.findOne({name: {$eq: val}});

            if(roleInfor.users.length) {
                throw Error('Quyền tài khoản đã liên kết không thể thực hiện chức năng');
            }

            if(roleNameInfor) {
                throw Error('Quyền tài khoản đã tồn tại');
            }
        }

        return true;
    })
], ControllerRole.modifiRole);

// XOÁ TÀI PHÂN QUYỀN TÀI KHOẢN
router.post("/delete",[
    body('role').custom( async(val, {req}) => {
        if(!val.trim()) throw Error('Quyền tài khoản không được trống');
        if(val) {
            let roleInfor = await ModelRole.findOne({_id: {$eq: new ObjectId(val)}});

            if(roleInfor?.users.length) {
                throw Error('Phân quyền tài khoản có liêm kết không thể thực hiện chức năng');
            }
        }

        return true;
    }),

],ControllerRole.deleteRole);

module.exports = router;