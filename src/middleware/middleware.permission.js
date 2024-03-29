class MiddlewarePermission {

    constructor() { }

    // KIỂM TRA TÀI KHOẢN CÓ ĐỦ QUYỀN ĐỂ TRUY CẬP TRANG QUẢN TRỊ
    async permission(req, res, next) {
        let { infor } = req.session;

        if(infor && infor.role === "Admin") {
            req.user = infor;
            next();

        } else {
            req.flash('message', 'Vui longd đăng nhập!');
            res.redirect("/access/signin");
        }
    }

    // KIÊM TRA NGƯỜI DÙNG ĐĂNG NHẬP
    userExists = async (req, res, next) => {
        let { infor } = req.session;

        if(infor) {
            req.user = infor;
            next();

        } else {
            req.flash('message', 'Vui longd đăng nhập!');
            res.redirect("/access/signin");
        }
    }

}

module.exports = new MiddlewarePermission();