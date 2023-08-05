const mongodb = require("mongodb");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
const pdfkit = require("pdfkit");
const path = require('path');
const fs = require('fs');
const ObjectId = mongodb.ObjectId;

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
                const doc = new pdfkit();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

                doc.pipe(fs.createWriteStream(path.join(__dirname, "../", "document", 'invoice.pdf')));
                doc.pipe(res);

                doc.fontSize(25).text('Here is some vector graphics...', 100, 100);
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

}

module.exports = new ControllerOrder();