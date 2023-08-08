class ModelTransaction {

    constructor() { }

    // RENDER TRANG LỊCH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
    renderUserHistoryTransaction = async (req, res, next) => {
        try {
            let { infor } = req.session;

            res.render("pages/shop/page-transaction", {
                title: 'Lịch sử giao dịch khách hàng',
                path: 'gIAO-DICH',
                infor,
                csurfToken: req.csrfToken(),
                footer: false
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ModelTransaction();