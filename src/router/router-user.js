const router = require('express').Router();
const ModelUser = require("../model/model-user");
const { check, body } = require('express-validator');
const ControllerUser = require("../controller/controller-user");

router.get('/signin', ControllerUser.renderUserSignin);
router.get("/signup", ControllerUser.renderUserSignup);

router.get('/signout', ControllerUser.userSignout);

router.post("/signin",
    [
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
    ],
    ControllerUser.userSignin);

router.post('/signup', 
    [
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

module.exports = router;