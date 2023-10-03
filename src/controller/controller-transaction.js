"use strict"
const ServiceTransaction = require("../services/service.transaction");
class ControllerTransaction {

    constructor() { }

    // RENDER HISTORY TRANSACTION
    async renderHistoryTransaction (req, res, next) {
        try {
            let { paymentId, token, PayerID } = req.query;
            let { infor } = req.session;
            let { user } = req;

            if(paymentId) {
                await ServiceTransaction.create({model: user}, paymentId, async (information) => {
                    let { status, message, error } = information;
    
                    if(status) {
                        await ServiceTransaction.getTransactions({model: user}, (information) => {
                            let { status, message, transactions, error } = information;
    
                            if(status) {
                                return res.render("pages/shop/page-transaction", {
                                    title: 'Lịch sử giao dịch khách hàng',
                                    path: 'Giao-dich',
                                    infor,
                                    transactions,
                                    csurfToken: req.csrfToken(),
                                    footer: true
                                })
                            }
                        })
    
                    } else {
                        return res.redirect('/order');
                    }
                })

            } else {
                await ServiceTransaction.getTransactions({model: user}, (information) => {
                    let { status, message, transactions, error } = information;

                    if(status) {
                        return res.render("pages/shop/page-transaction", {
                            title: 'Lịch sử giao dịch khách hàng',
                            path: 'Giao-dich',
                            infor,
                            transactions,
                            csurfToken: req.csrfToken(),
                            footer: true
                        })
                    } else {
                        return res.redirect('/order');
                    }
                })
            }
            
        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerTransaction();