const router = require('express').Router();
const { body } = require('express-validator');
const ModelRole = require("../model/model-roles");
const ControllerRole = require("../controller/controller-role");

// HIỂN THỊ TRANG DANH SÁCH QUYỀN TÀI KHOẢN
router.get("/admin", ControllerRole.renderPageAdminRole);

// HIỂN THỊ TRANG THÊM MỚI QUYỀN TÀI KHOẢN
router.get("/admin/new", ControllerRole.renderPageAdminNewRole);

// THÊM MỚI PHÂN QUYỀN TÀI KHOẢN
router.post("/new", [
    body('role').custom(async (val, {req}) => {
        if(!val.trim()) throw Error('Quyền tài khaonr không được trống');
        if(val) {
            let roleInfor = await ModelRole.findOne({name: {$eq: val}});

            if(roleInfor) {
                throw Error('Quyền tài khoản đã tồn tại');
            }
        }

        return true;
    }),

], ControllerRole.createRole);

module.exports = router;