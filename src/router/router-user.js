const router = require('express').Router();
const ModelUser = require("../model/model-user");
const { check, body } = require('express-validator');
const ControllerUser = require("../controller/controller-user");

router.get('/signin', ControllerUser.renderUserSignin);
router.get('/signup', ControllerUser.renderUserSignup);
router.get('/signout', ControllerUser.userSignout);

router.get('/new', ControllerUser.renderNewAccount);
router.get('/edit', ControllerUser.renderEditAccount);

// KHÁCH HÀNG ĐĂNG NHẬP BẰNG TÀI KHOẢN
router.post("/signin",[
    check('email').isEmail().withMessage('Please enter e-mail'),
    body('password').trim().custom((value, {req}) => {
        if(!value) {
            throw new Error('Password cannot be empty');
        }

        if(value.length < 5 || value.length > 20) {
            throw new Error('Password must be longer than 5 characters and less than 20 characters');
        }
        return true;
    })
], ControllerUser.userSignin);


// KHÁCH HÀNG TỰ TẠO TÀI KHOẢN
router.post('/signup', [
    body('user_name').custom((value, {red}) => {
        if(!value) throw new Error('User name not be empty')
        return true;
    }),
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
    })
], ControllerUser.userSignup);


// ADMIN TẠO MỚI THÔNG TIN ACCOUNT
router.post("/new",
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

], ControllerUser.newAccount);


// ADMIN SỮA THÔNG TIN TÀI KHOẢN
router.post('/edit', [
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
], ControllerUser.editAccount);


// ADMIN XOÁ THÔNG TIN ACCOUNT
router.post('/delete', [
    body('user').notEmpty().withMessage('User ID not empty'),
], ControllerUser.deleteAccount);

module.exports = router;