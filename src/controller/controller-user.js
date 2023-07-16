const ModelUser = require("../model/model-user");
const ModelRole = require("../model/model-roles");
const utilbcrypt = require("../utils/util-bcrypt");
const { validationResult } = require('express-validator');
class ControllerUser {

    constructor() { }

    // RENDER TRANG NGƯỜI DÙNG ĐĂNG NHẬP
    renderUserSignin = (req, res, next) => {
        res.render("pages/auth/page-auth-signin", {
            title: 'Đăng ký',
            path: "Dang-nhap",
            isUser: req.cookies.user? true : false,
            csurfToken: req.csrfToken(),
            inputsErrors: [],
            formField: {
                email: '',
                password: ''
            }
        })
    }

    // RENDER TRANG ĐỂ NGƯỜI DÙNG TỰ ĐĂNG KÝ
    renderUserSignup = (req, res, next) => {
        res.render("pages/auth/page-auth-signup", {
            title: 'Đăng nhập',
            path: "Dang-ky",
            isUser: req.cookies.user? true : false,
            csurfToken: req.csrfToken(),
            formError: req.flash('form-error'),
            inputsErrors: [],
            formField: {
                user_name: '',
                email: '',
                password: '',
                password_confirm: ''
            }
        })
    }

    // RENDER TRANG ĐỂ ADMIN TẠO TÀI KHOẢN CHO NGƯỜI DÙNG
    renderNewAccount = async (req, res, next) => {
        try {
            let roles = await ModelRole.find({}).select('name');

            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                inputsErrors: [],
                roles,
                formField: {
                    user_name: '',
                    email: '',
                    password: '',
                    password_confirm: '',
                    role: ''
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }

    }

    // RENDER TRANG ĐỂ ADMIN CHỈNH SỬA THÔNG TIN TÀI KHOẢN
    renderEditAccount = async (req, res, next) => {
        let { user } = req.query;

        try {
            let roles = await ModelRole.find({}).select('name');
            let userInfor = await ModelUser.findOne({_id: {$eq: user}}).populate('role').exec();

            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                inputsErrors: [],
                roles,
                formField: {
                    id: userInfor._id,
                    user_name: userInfor.name,
                    email: userInfor.email,
                    role: userInfor?.role? userInfor.role._id : null,
                }
            })


        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // NGƯỜI DÙNG ĐĂNG XUẤT
    userSignout = (req, res, next) => {
        res.cookie('user', null, {expires: new Date(0)});
        res.redirect('/');
    }

    // NGƯỜI DÙNG ĐĂNG NHẬP
    userSignin = async (req, res, next) => {
        let { email , password} = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/auth/page-auth-signin", {
                title: 'Đăng ký',
                path: "Dang-nhap",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                formField: { email, password }
            })

        } else {
            try {
                let user = await ModelUser.findOne({email: {$eq: email}});

                if(user) {
                    utilbcrypt.compare(password, user.password, (status) => {
                        if(status) {
                            res.cookie('user', {username: user.name, email: user.email});
                            res.redirect("/");
                        }
                    })

                } else {
                    req.flash('form-error', "Tài khoản chưa đăng ký");
                    res.redirect("/user/signup");
                }
                
            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

    // NGƯỜI DÙNG ĐĂNG KÝ
    userSignup = async (req, res, next) => {
        let { user_name, email, password, password_confirm} = req.body;
        let {errors} = validationResult(req);

        if(errors.length) {
            res.render("pages/auth/page-auth-signup", {
                title: 'Đăng nhập',
                path: "Dang-ky",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                formError: req.flash('form-error'),
                inputsErrors: errors,
                formField: { user_name, email, password, password_confirm }
            })

        } else {
            try {
                utilbcrypt.hash(password, async (infor) => {
                    let user = await ModelUser.create({name: user_name, email, password: infor.hash});
                    if(user) {
                        res.cookie('user', {username: user.name, email: user.email});
                        res.redirect("/");
                    }
                })

            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);

            }
        }
    }

    // ADMIN TẠO TÀI KHOẢN NGƯỜI DÙNG
    newAccount = async (req, res, next) => {
        let roles = await ModelRole.find({});
        let { user_name, email, password, password_confirm, role } = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: { user_name, email, password, password_confirm, role }
            })

        } else {
            try {
                utilbcrypt.hash(password, async (infor) => {
                    let typeRole = roles.find((elm) => elm.id.toString() == role);
                    let user = await ModelUser.create({name: user_name, email, password: infor.hash, role: typeRole});
                    if(user) {
                        typeRole.users.push(user);
                        await typeRole.save();
                        res.redirect("/admin/user");
                    }
                })

            } catch (err) {
                let error = new Error(err.message);
                error.httpStatusCode = 500;
                return next(error);

            }
        }

    }

    // ADMIN SỬA THÔNG TIN TÀI KHOẢN
    editAccount = async (req, res, next) => {
        let roles = await ModelRole.find({}).populate('users');
        let { id, user_name, email,  role} = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                isUser: req.cookies.user? true : false,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: {
                    id,
                    user_name,
                    email,
                    role,
                }
            })

        } else {
            try {
                let user = await ModelUser.findOne({_id: {$eq: id}}).populate('role');

                user.name = user_name;
                user.email = email;

                if(!user.hasOwnProperty('role')) {
                    // TRƯỜNG HỢP ACCOUNT KHÔNG CÓ ROLE THÊM MỚI
                    let newRole = roles.find((elm) => elm._id.toString() === role);

                    user.role = newRole;
                    await user.save();

                    newRole.users.push(user);
                    await newRole.save();


                } else if(user.role._id.toString() !== role) {
                    // TRƯỜNG HỢP ACCOUNT ĐÃ CÓ ROLE VÀ MUỐN CHUYỂN SANG ROLE KHÁC

                    let oldRoleUser = roles.find((elm) => elm._id.toString() === user.role._id.toString());

                    if(oldRoleUser.users.length) {
                        let index = oldRoleUser.users.findIndex((elm) => elm._id.toString() === user._id.toString());
                        oldRoleUser.users.splice(index, 1);
                        await oldRoleUser.save();
                    }

                    let newRoleUser = roles.find((elm) => elm._id.toString() === role);
                    user.role = newRoleUser;
                    await user.save();

                    newRoleUser.users.push(user);
                    await newRoleUser.save();

                } else {
                    // TRƯỜNG HỢP ACCOUNT ĐÃ CÓ ROLE VÀ KHÔNG SỬA ROLE
                    await user.save();

                }

                res.redirect("/admin/user");

            } catch (err) {
                let error = Error(err.message);
                error.httpsStatusCode = 500;
                return next(error);
            }
        }

    }
}

module.exports = new ControllerUser();