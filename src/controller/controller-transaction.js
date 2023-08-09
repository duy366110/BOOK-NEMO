const ModelTransaction = require("../model/model-transaction");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
// const paypal = require('paypal-rest-sdk');
class ControllerTransaction {

    constructor() { }

    // RENDER TRANG LỊCH SỬ GIAO DỊCH CỦA KHÁCH HÀNG
    renderUserHistoryTransaction = async (req, res, next) => {
        try {
            let { infor } = req.session;

            // NHẬN THÔNG TIN TỪ ORDER SAU KHI THANH TOÁN THÀNH CÔNG
            let { paymentId, token, PayerID } = req.query;

            let userInfor = await ModelUser.findById(infor.id).populate(['order']).exec();

            if(paymentId) {
                try {

                    // TÌM THÔNG TIN ORDER         
                    let orderInfor = await ModelOrder.findById(userInfor.order._id).populate(['order.product']).exec();

                    // THANH TOÁN TẠO TRANSACTION CHO GIAO DỊCH
                    let transaction = await ModelTransaction.create({user: userInfor, payment_id: paymentId, order: orderInfor.order });

                    if(transaction) {
                        // CẬP NHẬT THÔNG TIN TRANSACTION CHO NGƯỜI DÙNG
                        userInfor.order = null;
                        userInfor.transactions.push(transaction);
                        await userInfor.save();
                        await orderInfor.deleteOne();
                    }

                } catch (err) {
                    let error = Error(err.message);
                    error.httpStatusCode = 500;
                    return next(error);
                }
            }

            // DỰA VÀ USER TÌN THÔNG TIN TRANSACTION CỦA USER.
            let transactionsInfor = await ModelTransaction
                                            .find({_id: {$in: userInfor.transactions}})
                                            .populate(['user', 'order.product'])
                                            .exec();

            if(transactionsInfor.length) {
                // THỰC FORMAT DATA TRANSACTION HIỂN THỊ PHÍA NGƯỜI DÙNG
                transactionsInfor = transactionsInfor.map((transaction) => {
                    transaction.paymentDate = new Date(transaction.paymentDate).toLocaleString();

                    // TÍNH TỔNG HOÁ ĐƠN
                    transaction.total = Number(transaction.order.reduce((acc, order) => {
                        acc += Number(order.product.price) * Number(order.quantity);
                        return acc;
                    }, 0)).toFixed(3);

                    // THỰC HIỆN FORMAT GIÁ SẢN PHẨM
                    transaction.order = transaction.order.map((order) => {
                        order.product.price = Number(order.product.price).toFixed(3);
                        return order;
                    })
                    return transaction;
                })
            }

            // REANDER VIEW PHÍA NGƯỜI DÙNG
            res.render("pages/shop/page-transaction", {
                title: 'Lịch sử giao dịch khách hàng',
                path: 'Giao-dich',
                infor,
                transactions: transactionsInfor.length? transactionsInfor : null,
                csurfToken: req.csrfToken(),
                footer: true
            })
            
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