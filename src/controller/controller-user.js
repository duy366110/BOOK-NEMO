const ModelUser = require("../model/model-user");
class ControllerUser {

    constructor() { }

    renderUserSignin = (req, res, next) => {
        res.render("pages/auth/page-auth-signin", {
            title: 'Đăng ký',
            path: "Dang-nhap"
        })
    }

    renderUserSignup = (req, res, next) => {
        res.render("pages/auth/page-auth-signup", {
            title: 'Đăng nhập',
            path: "Dang-ky"
        })
    }

    fetchUserById = (req, res, next) => { }

    saveUser = (req, res, next) => { }

    updateUser = (req, res, next) => { }

    deleteUser = (req, res, next) => { }
}

module.exports = new ControllerUser();