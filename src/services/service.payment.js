"use strict"
const CONFIG_PAYPAL = require("../configs/config.paypal");
const paypal = require('paypal-rest-sdk');

class ServicePayment {

    constructor() { }

    async payment(user = {}, cb) {
        try {
            // TÍNH TỔNG HOÁ ĐƠN
            let total = Number(user.model.order.collections.reduce((acc, order) => {
                acc += Number(order.product.price) * Number(order.quantity);
                return acc;
            }, 0)).toFixed(2);

            // CẤU HÌNH PAYPAL THANH TOÁN HOÁ ĐƠN
            let create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": CONFIG_PAYPAL.PAGE_SUCCESS,
                    "cancel_url": CONFIG_PAYPAL.PAGE_CANCEL
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Payment order",
                            "sku": "Payment order",
                            "price": parseFloat(total),
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": parseFloat(total)
                    },
                    "description": "This is the payment description."
                }]
            };

            // TIẾN HÀNH THANH TOÁN
            paypal.payment.create(create_payment_json, function (error, payment) {

                if (error) {
                    throw error;

                } else {
                    // PAYPAL CHẤP NHẬN THANH TOÁN - CHUYỂN ĐẾN TRANG THANH TOÁN
                    for(let link of payment.links ) {
                        if(link.rel === 'approval_url') {
                            cb({status: true, message: 'User payment order product successfully', link: link.href});
                            break
                        }
                    }
                }
            });

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServicePayment();