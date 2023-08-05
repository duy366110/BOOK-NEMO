const mongodb = require("mongodb");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
const pdfkit = require("pdfkit");
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
            let { user } = req.cookies;
            let isRole  = req.session.role;

            if(user) {
                try {

                    let orderInfor = await ModelOrder
                    .findOne({email: {$eq: user.email}})
                    .populate('user_id')
                    .populate('order.product')
                    .exec();

                    if(orderInfor) {
                        let total = orderInfor.order.reduce((acc, order) => {
                            acc += parseFloat(order.quantity) * parseFloat(order.product.price);
                            return acc;
                        }, 0)
        
                        res.render("pages/shop/page-order", {
                            title: 'Đơn hàng',
                            path: 'Don-hang',
                            isLogin: req.cookies.user? true : false,
                            isRole:  isRole? isRole : '',
                            csurfToken: req.csrfToken(),
                            formError: req.flash('error'),
                            bill: orderInfor,
                            total: total,
                        })

                    } else {
                        res.render("pages/shop/page-order", {
                            title: 'Đơn hàng',
                            path: 'Don-hang',
                            isLogin: req.cookies.user? true : false,
                            isRole:  isRole? isRole : '',
                            csurfToken: req.csrfToken(),
                            formError: req.flash('error'),
                            bill: null,
                            total: 0,
                        })
                    }

                } catch (err) {
                    let error = Error(err.message);
                    error.httpStatusCode = 500;
                    return next(error);
                }
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
            let orderInfor = await ModelOrder.findOne({user_id: {$eq: new ObjectId(user)}})
                            .populate('user_id')
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
                    ['Họ và tên', `${orderInfor.user_id.name}`],
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
                let userInfor = await ModelUser.findById(user).populate('cart.product');
                let orderInfor = await ModelOrder.create({
                    user_id: userInfor,
                    email: userInfor.email,
                    order: userInfor.cart
                });

                if(orderInfor) {
                    userInfor.cart = [];
                    await userInfor.save();
                    res.redirect("/");
                }
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // KHACH HANG THANH TOAN
    orderPayment = async(req, res, next) => {
        let create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://booknemo-dd8b0f6425b8.herokuapp.com",
                "cancel_url": "https://booknemo-dd8b0f6425b8.herokuapp.com"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": "1.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "1.00"
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;

            } else {
                for(let link of payment.links ) {
                    if(link.rel === 'approval_url') {
                        res.redirect(link.href);
                    }
                }
            }
        });
    }

}

module.exports = new ControllerOrder();