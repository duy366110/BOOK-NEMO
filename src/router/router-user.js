"use strict"
const router = require('express').Router();
const ModelUser = require("../model/model-user");
const { body } = require('express-validator');
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareAmount = require("../middleware/middleware.amount");
const MiddlewareRole = require("../middleware/middleware.role");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerUser = require("../controller/controller-user");

//RENDER PAGE USERS
router.get("/admin/:page", MiddlewarePermission.permission, MiddlewareAmount.getAmountUser, ControllerUser.renderPageAdminUser);

//RENDER PAGE NEW USER
router.get('/new', MiddlewarePermission.permission, ControllerUser.renderNewAccount);

//RENDER PAGE UPDATE USER
router.get('/edit', MiddlewarePermission.permission, MiddlewareUser.findUserByQueryParams, ControllerUser.renderEditAccount);

//NEW USER
router.post("/new",
MiddlewarePermission.permission,
[
    body('user_name').notEmpty().withMessage('User name not be empty'),
    body('email').custom(async (value, {req}) => {
        if(!value) throw new Error('E-mail cannot be empty');

        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value)) {
            throw Error('Please enter e-mail');
        }

        if(value) {
            let user = await ModelUser.findOne({email: {$eq: value}});
            if(user) {
                throw new Error('E-mail exists already, please to page login');
            }
            return true;
        }
        return true;
    }),
    body('password').trim().custom((value, {req}) => {
        if(!value) throw new Error('Password cannot be empty')
        if(value.length < 5 || value.length > 20) throw new Error('Password must be longer than 5 characters and less than 20 characters')
        return true;
    }),
    body('password_confirm').trim().custom((value, {req}) => {
        if(!value) throw new Error('Password confirm not be empty')
        if(value !== req.body.password) throw new Error('Password confirm not match password')
        return true;
    }),
    body('role').custom((value, {req}) => {
        if(value === 'default') throw Error('Quyền tài khoản không được trống');
        return true;
    })

],
MiddlewareRole.findRoles,
ControllerUser.create);


//UPDATE USER
router.post('/edit',
MiddlewarePermission.permission,
[
    body('user_name').notEmpty().withMessage('User name not be empty'),
    body('email').custom(async (value, {req}) => {
        if(!value) throw new Error('E-mail cannot be empty');
        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value)) {
            throw Error('Please enter e-mail');
        }
        
        return true;
    }),
    body('role').custom((value, {req}) => {
        if(value === 'default') throw Error('Quyền tài khoản không được trống');
        return true;
    })
],
MiddlewareRole.findRoles,
MiddlewareRole.findRoleById,
MiddlewareUser.findUserById,
ControllerUser.update);


//DELETE USER
router.post('/delete', MiddlewarePermission.permission,
[
    body('user').notEmpty().withMessage('User ID not empty'),
],
MiddlewareUser.findUserById,
ControllerUser.delete);

module.exports = router;