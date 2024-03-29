"use strict"
const { validationResult } = require('express-validator');
const ServiceAccess = require("../services/service.access");
const ServiceUser = require("../services/service.user");

class ControllerAccess {

    constructor() { }

    // RENDER PAGE USER SIGNUP ACCOUNT
    renderUserSignup (req, res, next) {
        let { infor } = req.session;
        let { message } = req.flash();

        res.render("pages/auth/page-auth-signup", {
            title: 'Đăng nhập',
            path: "Dang-ky",
            infor: infor? infor : null,
            csurfToken: req.csrfToken(),
            message: (message && message.length)? message[0] : '',
            inputsErrors: [],
            formField: { user_name: '', email: '', password: '', password_confirm: '' },
            footer: false
        })
    }

    // RENDER PAGE SIGNIN ACCOUNT.
    renderUserSignin (req, res, next) {
        let { infor } = req.session;
        let { message } = req.flash();

        res.render("pages/auth/page-auth-signin", {
            title: 'Đăng ký',
            path: "Dang-nhap",
            infor: infor? infor : null,
            csurfToken: req.csrfToken(),
            message: (message && message.length)? message[0] : '',
            inputsErrors: [],
            formField: {email: '', password: ''},
            footer: false
        })
    }

    // USER SIGNUP
    async signup(req, res, next) {
        let {errors} = validationResult(req);
        let { user_name, email, password, password_confirm} = req.body;
        let { infor } = req.session;

        if(errors.length) {
            res.render("pages/auth/page-auth-signup", {
                title: 'Đăng nhập',
                path: "Dang-ky",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                message: '',
                inputsErrors: errors,
                formField: { user_name, email, password, password_confirm },
                footer: false
            })

        } else {
            try {
                let { roleClient } = req;
                await ServiceUser.create({name: user_name, email, password}, roleClient, (information) => {
                    let { status, message, user, error } = information;

                    if(status) {
                        req.session.infor = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: roleClient.name
                        }
                        res.redirect("/");

                    } else {
                        let err = new Error(message);
                        err.httpStatusCode = 500;
                        return next(err);
                    }

                })

            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);

            }
        }
    }

    // USER SIGNIN
    async signin(req, res, next) {
        let { errors } = validationResult(req);
        let { email , password} = req.body;
        let { infor } = req.session;

        if(errors.length) {
            res.render("pages/auth/page-auth-signin", {
                title: 'Đăng ký',
                path: "Dang-nhap",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                message: '',
                inputsErrors: errors,
                formField: { email, password },
                message: '',
                footer: false
            })

        } else {
            try {
                await ServiceUser.getUserByEmail(email, (information) => {
                    let { status, message, user, error } = information;

                    if(status && user) {
                        ServiceAccess.verifyUserAccount({model: user, password}, (information) => {
                            let { status, message, user } = information;

                            if(status) {
                                req.session.infor = {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role.name
                                }
                                res.redirect("/");

                            } else {
                                res.render("pages/auth/page-auth-signin", {
                                    title: 'Đăng ký',
                                    path: "Dang-nhap",
                                    infor: infor? infor : null,
                                    csurfToken: req.csrfToken(),
                                    message: 'E-mail hoặc mật khẩu không hợp lệ',
                                    inputsErrors: [],
                                    formField: { email, password },
                                    footer: false
                                })
                            }

                        })

                    } else {
                        req.flash('message', "Tài khoản chưa đăng ký");
                        res.redirect("/access/signup");
                    }
                })
                
            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // USER SIGNOUT
    async signout(req, res, next) {
        req.session.destroy((err) => {
            if(err) {
                let error = Error('Đăng xuất không thành công');
                error.httpStatusCode = 500;
                return next(error);

            } else {
                res.cookie('user', null, {expires: new Date(0)});
                res.redirect('/');

            }
        })
    }

}

module.exports = new ControllerAccess();