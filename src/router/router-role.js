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

//RENDER PAGE ADMIN ROLE
router.get("/admin/:page",
MiddlewarePermission.permission,
MiddlewareAmount.getAmountRole,
ControllerRole.renderPageAdminRole);

//RENDER PAGE NEW ROLE
router.get("/new", MiddlewarePermission.permission, ControllerRole.renderPageAdminNewRole);

//RENDER PAGE UPDATE ROLE
router.get("/edit/:role", ControllerRole.renderPageAdminEditRole);

//NEW ROLE
router.post("/new",
MiddlewarePermission.permission,
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

//UPDATE ROLE
router.post("/edit",
MiddlewarePermission.permission,
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
],
MiddlewareRole.findRoleById,
ControllerRole.update);

//REMOVE ROLE
router.post("/delete",
MiddlewarePermission.permission,
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

],
MiddlewareRole.findRoleById,
ControllerRole.delete);

module.exports = router;