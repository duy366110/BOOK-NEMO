const paypal = require("paypal-rest-sdk");
class ModelTransaction {

    constructor() { }

    // RENDER TRANG LỊCH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
    renderUserHistoryTransaction = async (req, res, next) => {
        try {
            let { infor } = req.session;
            let payment = req.flash('payment');

            if(payment.length) {
                let infor = payment[payment.length - 1];
                res.render("pages/shop/page-transaction", {
                    title: 'Lịch sử giao dịch khách hàng',
                    path: 'Giao-dich',
                    infor,
                    csurfToken: req.csrfToken(),
                    footer: true
                })

            } else {
                res.redirect('/order');
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ModelTransaction();