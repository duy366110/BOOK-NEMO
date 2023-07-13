const ModelUser = require("../model/model-user");
const utilbcrypt = require("../utils/util-bcrypt");
class ControllerUser {

    constructor() { }

    renderUserSignin = (req, res, next) => {
        res.render("pages/auth/page-auth-signin", {
            title: 'Đăng ký',
            path: "Dang-nhap",
            isUser: req.cookies.user? true : false
        })
    }

    renderUserSignup = (req, res, next) => {
        res.render("pages/auth/page-auth-signup", {
            title: 'Đăng nhập',
            path: "Dang-ky",
            isUser: req.cookies.user? true : false
        })
    }

    userSignout = (req, res, next) => {
        res.cookie('user', null, {expires: new Date(0)});
        res.redirect('/');
    }

    userSignin = (req, res, next) => {
        let { email , password} = req.body;

        ModelUser.findOne({email: {$eq: email}})
        .then((user) => {
            if(user) {
                utilbcrypt.compare(password, user.password, (status) => {
                    if(status) {
                        res.cookie('user', {username: user.name, email: user.email});
                        res.redirect("/");
                    }
                })

            } else {
                res.redirect("/user/signup");
            }
        })
        .catch((error) => {
            res.status(400).json({status: false, error});

        })
    }

    userSignup = (req, res, next) => {
        let { username, email, password} = req.body;
        utilbcrypt.hash(password, (infor) => {
            ModelUser.create({name: username, email, password: infor.hash})
            .then((user) => {
                if(user) {
                    res.cookie('user', {username: user.name, email: user.email});
                    res.redirect("/");
                }

            })
            .catch((error) => {
                res.status(400).json({status: false, error});

            })
        })
    }

    fetchUserById = (req, res, next) => { }

    saveUser = (req, res, next) => { }

    updateUser = (req, res, next) => { }

    deleteUser = (req, res, next) => { }
}

module.exports = new ControllerUser();