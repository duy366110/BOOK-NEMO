"use strict"
const router = require('express').Router();
const mongodb = require('mongodb');
const { body } = require('express-validator');
const ModelRole = require("../model/model-roles");
const MiddlewareAmount = require("../middleware/middleware.amount");
const MiddlewarePermission = require("../middleware/middleware.permission");
const ControllerRole = require("../controller/controller-role");
const MiddlewareRole = require('../middleware/middleware.role');
const ObjectId = mongodb.ObjectId;

// HIỂN THỊ TRANG DANH SÁCH QUYỀN TÀI KHOẢN
router.get("/admin/:page",
MiddlewarePermission.permission,
MiddlewareAmount.getAmountRole,
ControllerRole.renderPageAdminRole);

// HIỂN THỊ TRANG THÊM MỚI QUYỀN TÀI KHOẢN
router.get("/new", MiddlewarePermission.permission, ControllerRole.renderPageAdminNewRole);

// HIỂN THỊ TRANG SỮA THÔNG TIN QUYỀN TÀI KHOẢN
router.get("/edit/:role", ControllerRole.renderPageAdminEditRole);

// THÊM MỚI PHÂN QUYỀN TÀI KHOẢN
router.post("/new", MiddlewarePermission.permission,
[
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

], ControllerRole.create);

// CẬP NHẬT THÔNG TIN PHÂN QUYỀN TÀI KHOẢN
router.post("/edit", MiddlewarePermission.permission,
[
    body('role').notEmpty().withMessage('Token quyền tài khoản không được trống'),
    body('name').custom( async(val, {req}) => {
        if(!val.trim()) throw Error('Quyền tài khoản không được trống');

        if(val) {
            let roleInfor = await ModelRole.findById(req.body.role);
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
], MiddlewareRole.findRoleById, ControllerRole.update);

// XOÁ TÀI PHÂN QUYỀN TÀI KHOẢN
router.post("/delete", MiddlewarePermission.permission,
[
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

], MiddlewareRole.findRoleById ,ControllerRole.delete);

module.exports = router;