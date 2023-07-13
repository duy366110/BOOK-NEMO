const router = require('express').Router();
const { check } = require('express-validator');
const MiddlewareUser = require("../middleware/middleware-user");
const ControllerUser = require("../controller/controller-user");

router.get('/signin', ControllerUser.renderUserSignin);
router.get("/signup", ControllerUser.renderUserSignup);

router.get('/signout', ControllerUser.userSignout);
router.post("/signin", [check('email').isEmail().withMessage('Invalid e-mail')], ControllerUser.userSignin);
router.post('/signup', MiddlewareUser.userExists, ControllerUser.userSignup);

module.exports = router;