class MiddlewarePermission {

    constructor() { }

    // KIỂM TRA TÀI KHOẢN CÓ ĐỦ QUYỀN ĐỂ TRUY CẬP TRANG QUẢN TRỊ
    permission = async (req, res, next) => {
        let { infor } = req.session;

        if(infor && infor.role === "Admin") {
            next();

        } else {
            res.redirect("/user/signin");
        }
    }

    // KIÊM TRA NGƯỜI DÙNG ĐĂNG NHẬP
    userExists = async (req, res, next) => {
        let { infor } = req.session;

        if(infor) {
            next();

        } else {
            res.redirect("/user/signin");
        }
    }

}

module.exports = new MiddlewarePermission();