const mongodb = require("mongodb");
const ModelOrder = require("../model/model-order");
const ModelUser = require("../model/model-user");
const pdf = require('pdf-creator-node');
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
                let information = {
                    user_name: orderInfor.user_id.name,
                    user_email: orderInfor.email,
                    total: Number(orderInfor.order.reduce((acc, order) => {
                        acc += parseFloat(order.quantity) * parseFloat(order.product.price);
                        return acc;
                    }, 0)).toFixed(3),
                    orders: orderInfor.order.map((order, index) => {
                        return {
                            index,
                            product_name: order.product.title,
                            product_image: order.product.image,
                            product_price: order.product.price,
                            quantity: order.quantity,
                        }
                    })
                }

                let html = fs.readFileSync(path.join(__dirname, "../", "document", "invoice.html"), "utf-8");
                let options = {
                    format: "A4",
                    orientation: "portrait",
                    border: "10mm",
                    localUrlAccess: true,
                    header: {
                        height: "15mm",
                        contents: '<div style="text-align: center;"></div>'
                    },
                    footer: {
                        height: "30.7mm",
                        contents: {
                            first: 'Cover page',
                            2: 'Second page', // Any page number is working. 1-based index
                            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                            last: 'Last Page'
                        }
                    }
                };

                var document = {
                    html: html,
                    data: {
                    bill: information,
                    },
                    path: path.join(__dirname, "../", "document", "invoice.pdf"),
                };

                await pdf.create(document, options, {
                    childProcessOptions: {
                      env: {
                        OPENSSL_CONF: '/dev/null',
                      },
                    }
                  });

                // pdf.create(html, { childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}).toFile(`./public/invoices/${order.id}.pdf`, (err, res) => {
                //     if (err) return console.log(err);
                // });

                let pdfPath = path.join(__dirname, "../", "document", "invoice.pdf");
                // let fileDoc = fs.createReadStream(pdfPath);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition',"inline; filename=invoice.pdf");

                // fileDoc.pipe(res);

                let data = fs.readFileSync(pdfPath);
                res.send(data);


            } else {
                res.redirect("/order");
            }

        } catch (err) {
            throw err;
            // let error = Error(err.message);
            // error.httpStatusCode = 500;
            // return next(error);
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