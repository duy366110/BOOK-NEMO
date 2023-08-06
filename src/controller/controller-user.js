const ModelUser = require("../model/model-user");
const ModelRole = require("../model/model-roles");
const utilbcrypt = require("../utils/util-bcrypt");
const { validationResult } = require('express-validator');
class ControllerUser {

    constructor() { }

    // RENDER TRANG QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
    renderPageAdminUser = async (req, res, next) => {

        try {
            let { infor } = req.session;
            let users = await ModelUser.find({}).select(['name', 'email', 'role']).populate('role');

            res.render('pages/admin/page-admin-user', {
                title: 'Quản trị người dùng',
                path: 'Quan-tri',
                infor,
                users,
                csurfToken: req.csrfToken()
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);

        }
    }

    // RENDER TRANG NGƯỜI DÙNG ĐĂNG NHẬP
    renderUserSignin = (req, res, next) => {
        let { infor } = req.session;

        res.render("pages/auth/page-auth-signin", {
            title: 'Đăng ký',
            path: "Dang-nhap",
            infor: infor? infor : null,
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
        let { infor } = req.session;

        res.render("pages/auth/page-auth-signup", {
            title: 'Đăng nhập',
            path: "Dang-ky",
            infor: infor? infor : null,
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
            let { infor } = req.session;
            let roles = await ModelRole.find({}).select('name');

            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
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
        try {
            let { infor } = req.session;
            let { user } = req.query;

            let roles = await ModelRole.find({}).select('name');
            let userInfor = await ModelUser.findOne({_id: {$eq: user}}).populate('role').exec();

            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
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
        req.session.destroy((err) => {
            if(err) {
                let error = Error('Logout failed');
                error.httpStatusCode = 500;
                return next(error);

            } else {
                res.cookie('user', null, {expires: new Date(0)});
                res.redirect('/');

            }
        })
    }

    // NGƯỜI DÙNG ĐĂNG NHẬP
    userSignin = async (req, res, next) => {
        let { email , password} = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/auth/page-auth-signin", {
                title: 'Đăng ký',
                path: "Dang-nhap",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                formField: { email, password }
            })

        } else {
            try {
                let user = await ModelUser.findOne({email: {$eq: email}}).populate('role');

                if(user) {
                    utilbcrypt.compare(password, user.password, (status) => {

                        if(status) {
                            req.session.infor = {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role.name
                            }
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
        let { infor } = req.session;
        let {errors} = validationResult(req);

        if(errors.length) {
            res.render("pages/auth/page-auth-signup", {
                title: 'Đăng nhập',
                path: "Dang-ky",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                formError: req.flash('form-error'),
                inputsErrors: errors,
                formField: { user_name, email, password, password_confirm }
            })

        } else {
            let clientRole = await ModelRole.findOne({name: 'Client'});

            try {
                utilbcrypt.hash(password, async (infor) => {
                    try {
                        let user = await ModelUser.create({name: user_name, email, password: infor.hash, role: clientRole});

                        if(user) {
                            clientRole.users.push(user);
                            await clientRole.save();

                            req.session.infor = {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role.name
                            }
                            res.redirect("/");
                        }

                    } catch (err) {
                        let error = new Error(err.message);
                        error.httpStatusCode = 500;
                        return next(error);

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
        let { user_name, email, password, password_confirm, role } = req.body;
        let { infor } = req.session;
        let { errors } = validationResult(req);
        let roles = await ModelRole.find({});

        if(errors.length) {
            res.render("pages/admin/user/page-admin-new-user", {
                title: 'Tạo tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: { user_name, email, password, password_confirm, role }
            })

        } else {
            try {
                // MÃ HOÁ MẬT KHẨU
                utilbcrypt.hash(password, async (infor) => {
                    let roleInfor = roles.filter((elm) => elm._id.toString() === role);
                    roleInfor = roleInfor.length? roleInfor[0] : null;

                    // TẠO MỚI ACCOUNT
                    let user = await ModelUser.create({
                        name: user_name,
                        email,
                        password: infor.hash,
                        role: roleInfor
                    });

                    if(user) {
                        // THÊM ACCOUNT VỪA TẠO VÀO ROLE
                        roleInfor.users.push(user);
                        await roleInfor.save();
                        res.redirect("/user/admin");
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
        let { infor } = req.session;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/user/page-admin-edit-user", {
                title: 'Chỉnh sửa thông tin tài khoản',
                path: "Quan-tri",
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                inputsErrors: errors,
                roles,
                formField: { id, user_name, email, role }
            })

        } else {
            try {
                // LẤY THÔNG TIN USẺ VÀ CẬP NHẬT
                let user = await ModelUser.findOne({_id: {$eq: id}}).populate('role');
                user.name = user_name;
                user.email = email;

                if(user.role._id.toString() !== role) {
                    // TRƯỜNG HỢP ACCOUNT ĐÃ CÓ ROLE VÀ MUỐN CHUYỂN SANG ROLE KHÁC
                    user.role.users = user.role.users.filter((elm) => elm._id.toString() !== user._id.toString());

                    await user.role.save();

                    let roleInfor = roles.find((elm) => elm._id.toString() === role);
                    if(!roleInfor) {
                        roleInfor = roles.find((elm) => elm.name === 'Client');
                    }

                    roleInfor.users.push(user);
                    await roleInfor.save();

                    user.role = roleInfor;
                }

                await user.save();
                res.redirect("/user/admin");

            } catch (err) {
                let error = Error(err.message);
                error.httpsStatusCode = 500;
                return next(error);
            }
        }

    }

    // ADMIN XOÁ TÀI KHOẢN
    deleteAccount = async (req, res, next) => {
        try {
            let { user } = req.body;
            let userInfor = await ModelUser.findById(user).populate('role');
            let roleInfor = userInfor.role;

            // TÌM XOÁ LIÊN KẾT TRONG ROLE TRƯỚC KHI XOÁ USER ACCOUNT
            roleInfor.users = roleInfor.users.filter((elm) => elm._id.toString() !== user);
            await roleInfor.save();
            await userInfor.deleteOne();
            
            res.redirect("/user/admin");


        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerUser();