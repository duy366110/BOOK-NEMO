const mongodb = require("mongodb");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
const pdfkitTable = require("pdfkit-table");
const path = require('path');
const fs = require('fs');
const ObjectId = mongodb.ObjectId;
const paypal = require("paypal-rest-sdk");

class ControllerOrder {

    constructor() { }

    // RENDER THÔNG TIN ĐƠN HÀNG CỦA KHÁCH HÀNG
    renderPageOrder = async(req, res, next) => {
        try {
            let { infor }= req.session;

            try {
                let total = 0;
                let orderInfor = await ModelOrder
                .findOne({email: {$eq: infor.email}})
                .populate('user')
                .populate('order.product')
                .exec();

                if(orderInfor) {
                    total = Number(orderInfor.order.reduce((acc, order) => {
                        acc += parseFloat(order.quantity) * parseFloat(order.product.price);
                        return acc;
                    }, 0)).toFixed(3);

                    orderInfor.order.map((order) => {
                        order.product.price = Number(order.product.price).toFixed(3);
                        return order;
                    })
                }
                
                res.render("pages/shop/page-order", {
                    title: 'Đơn hàng',
                    path: 'Don-hang',
                    infor: infor? infor : null,
                    csurfToken: req.csrfToken(),
                    formError: req.flash('error'),
                    bill: orderInfor? orderInfor : null,
                    total: total,
                    footer: true
                })

            } catch (err) {
                let error = Error(err.message);
                error.httpStatusCode = 500;
                return next(error);
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG RENDER HOÁ ĐƠN
    renderInvoice = async (req, res, next) => {
        try {
            let { user } = req.params;
            let orderInfor = await ModelOrder.findOne({user: {$eq: new ObjectId(user)}})
                            .populate('user')
                            .populate('order.product')
                            .exec();

            if(orderInfor) {
                const doc = new pdfkitTable({ margin: 30, size: 'A4', encodeURI: 'UTF-8' });
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

                let pathFont = path.join(__dirname,'../', 'public', 'fonts', 'Roboto-Regular.ttf' )

                doc.font(pathFont);
                doc.pipe(fs.createWriteStream(path.join(__dirname, "../", "document", 'invoice.pdf')));
                doc.pipe(res);

                doc.fontSize(18).text('HOÁ ĐƠN KHÁCH HÀNG', {width: 535, align: 'center'});

                let total = Number(
                    orderInfor.order.reduce((acc, order) => {
                        acc += parseFloat(order.product.price) * Number(order.quantity);
                        return acc;
                    }, 0)
                ).toFixed(3);

                let rowsInfor = [
                    ['Họ và tên', `${orderInfor.user.name}`],
                    ['E-mail', `${orderInfor.email}`],
                    ['Tổng hoá đơn', `${total} VND`]
                ]

                let rowsProduct = [
                   ...orderInfor.order.map((order, index) => {
                    return [
                        `${index}`,
                        `${order.product.title}`,
                        `${Number(order.product.price).toFixed(3)} VND`,
                        `${order.quantity}`,
                    ]
                   })
                ]

                const table = {
                    title: "Đơn hàng: sách",
                    subtitle: "Trạng thái: thanh toán hoá đơn sau",
                    headers: [ "STT", "Tên sản phẩm", "Giá", "Số Lượng" ],
                    rows: [
                      ...rowsProduct,
                      ...rowsInfor
                    ],
                  };

                doc.table(table, {
                    width: 535,
                    prepareHeader: () => {
                        doc.font(pathFont)
                    },
                    prepareRow: (row, indexColumn, indexRow, rectRow) => {
                        doc.font(pathFont);
                        indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
                    },
                });

                doc.end();

                let pathFile = path.join(__dirname, "../", "document", 'invoice.pdf');
                let filePDF = fs.createReadStream(pathFile);
                filePDF.pipe(res);

            } else {
                res.redirect("/order");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG THÊM GIỎ HÀNG VÀO HOÁ ĐƠN
    addOrder = async (req, res, next) => {
        try {
            let { user }= req.body;

            if(user) {
                let userInfor = await ModelUser.findById(user).populate(['cart.product', 'order']).exec();
                let orderInfor = userInfor.order;

                if(orderInfor) {
                    // THÊM CART VÀO ORDER HIỆN CÓ
                    orderInfor.order.push(...userInfor.cart);
                    await orderInfor.save();
                    userInfor.cart = [];

                } else {
                    // THỰC HIỆN TẠO ORDER
                    let statusCreateOrder = await ModelOrder.create({
                        user: userInfor,
                        email: userInfor.email,
                        order: userInfor.cart
                    });

                    if(statusCreateOrder) {
                        userInfor.cart = [];
                        // TẠO LIÊN KẾT GIỮA ORDER VÀ TÀI KHOẢN
                        userInfor.order = statusCreateOrder;
                    }
                }

                await userInfor.save();
                res.redirect("/order");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHACH HANG THANH TOAN
    orderPayment = async(req, res, next) => {
        try {
            let { user } = req.body;
            let userInfor = await ModelUser.findById(user).populate(['order']).exec();
            let orderInfor = await ModelOrder.findById(userInfor.order._id).populate(['order.product']).exec();

            // TÍNH TỔNG HOÁ ĐƠN
            let total = Number(orderInfor.order.reduce((acc, order) => {
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
                    "return_url": "https://booknemo-dd8b0f6425b8.herokuapp.com/transaction", //http://localhost:8080/transaction
                    "cancel_url": "https://booknemo-dd8b0f6425b8.herokuapp.com"
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
                req.flash('payment', {transaction: payment, order: orderInfor._id});

                if (error) {
                    throw error;

                } else {
                    // PAYPAL CHẤP NHẬN THANH TOÁN - CHUYỂN ĐẾN TRANG THANH TOÁN
                    for(let link of payment.links ) {
                        if(link.rel === 'approval_url') {
                            res.redirect(link.href);
                        }
                    }
                }
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHÁCH HÀNG HUỶ ĐƠN HÀNG
    orderCancel = async (req, res, next) => {
        try {
            let { infor } = req.session;
            let { order } = req.body;

            let orderInfor = await ModelOrder
                            .findById(order)
                            .populate(['user', "order.product"])
                            .exec();
            let userInfor = orderInfor.user;

            // XOÁ CỦA SẢN PHẨM VỚI HOÁ ĐƠN
            for(let order of orderInfor.order) {
                order.product.product_ref = order.product.product_ref - 1;
                await order.product.save();
            }

            // XOÁ ĐƠN HÀNG
            await orderInfor.deleteOne();

            userInfor.order = null;
            await userInfor.save();
            res.redirect("/order");

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

}

module.exports = new ControllerOrder();