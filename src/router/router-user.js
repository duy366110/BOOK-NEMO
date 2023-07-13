const router = require('express').Router();
const ControllerUser = require("../controller/controller-user");

router.get('/signin', ControllerUser.renderUserSignin);
router.get("/signup", ControllerUser.renderUserSignup);

router.post("/signin", (req, res, next) => { });
router.post('/signup', (req, res, next) => { });

module.exports = router;