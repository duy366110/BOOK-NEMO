class MiddlewarePermission {

    constructor() { }

    permission = async (req, res, next) => {
        let { infor } = req.session;

        if(infor && infor.role === "Admin") {
            next();

        } else {
            res.redirect("/user/signin");
        }
    }
}

module.exports = new MiddlewarePermission();