const ModelTransaction = require("../model/model-transaction");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
class ControllerTransaction {

    constructor() { }

    // RENDER TRANG LỊCH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
    renderUserHistoryTransaction = async (req, res, next) => {
        try {
            let { infor } = req.session;
            let payment = req.flash('payment');

            // console.log(payment);
            let result = payment[payment.length - 1];

            if(payment.length) {
                let orderInfor = await ModelOrder
                                        .findById(result.order)
                                        .populate(["user", 'order.product'])
                                        .exec();


                let transaction = await ModelTransaction
                                        .create({
                                            user: orderInfor.user,
                                            payment_id: result.transaction.id,
                                            order: orderInfor.order
                                        });
                if(transaction) {
                    let userInfor = orderInfor.user;
                    userInfor.order = null;
                    userInfor.transactions.push(transaction);
                    await userInfor.save();
                    await orderInfor.deleteOne();

                    res.redirect("/transaction");
                }
            } else {
                res.render("pages/shop/page-transaction", {
                    title: 'Lịch sử giao dịch khách hàng',
                    path: 'Giao-dich',
                    infor,
                    csurfToken: req.csrfToken(),
                    footer: true
                })
            }
            
        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // LƯU THÔNG TIN HOÁ ĐƠN SAU KHI KHÁCH HÀNG ĐI PAYMENT THÀNH CÔNG
    createTransaction = async(req, res, next) => {
        try {
            let payment = req.flash('payment');
            console.log(payment);

            // let inforTransaction = req.session;

            // console.log(inforTransaction);

            // let transactionInfor = payment[payment.length - 1];

            // let orderInfor = await ModelOrder.findById(transactionInfor.order).populate(["user", 'order.product']).exec();
            // let transaction = await ModelTransaction.create({user: orderInfor.user, payment_id: transactionInfor.id, order: orderInfor.order});

            // if(transaction) {
            //     let userInfor = orderInfor.user;
            //     userInfor.order = [];
            //     userInfor.transactions.push(transaction);
            //     await userInfor.save();
            //     await orderInfor.deleteOne();

            //     res.redirect("/transaction");
            // }

            res.redirect("/transaction");

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG HUỶ GIAO DICH
    cancelTransaction = async(req, res, next) => {
        try {

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerTransaction();