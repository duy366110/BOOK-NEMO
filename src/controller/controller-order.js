"use strict"
const path = require('path');
const fs = require('fs');
const ServiceOrder = require("../services/service.order");
const ServicePayment = require("../services/service.payment");

class ControllerOrder {

    constructor() { }

    // RENDER PAGE ORDER OF USER
    renderPageOrder = async(req, res, next) => {
        try {
            let { infor } = req.session;

            if(infor && infor.id) {
                await ServiceOrder.getOrderById({id: infor.id}, (information) => {
                    let total = 0;
                    let { status, message, order, error } = information;

                    if(status) {
                        if(order) {
                            total = Number(order.collections.reduce((acc, orderElm) => {
                                acc += parseFloat(orderElm.quantity) * parseFloat(orderElm.product.price);
                                return acc;
                            }, 0)).toFixed(3);

                            order.collections.map((orderElm) => {
                                orderElm.product.price = Number(orderElm.product.price).toFixed(3);
                                return orderElm;
                            })
                        }

                        res.render("pages/shop/page-order", {
                            title: 'Đơn hàng',
                            path: 'Don-hang',
                            infor: infor? infor : null,
                            csurfToken: req.csrfToken(),
                            formError: req.flash('error'),
                            order: order? order : null,
                            total: total,
                            footer: true
                        })

                    } else {
                        let err = new Error(message);
                        err.httStatusCode = 500;
                        return next(err);
                    }
                })

            } else {
                return res.redirect("/access/signin");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // RENDER INVOICE
    async renderInvoice(req, res, next) {
        try {
            let { user } = req;

            await ServiceOrder.invoice({model: user}, res, (information) => {
                let { status, message, error } = information;

                if(status) {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
                    let pathFile = path.join(__dirname, "../", "document", 'invoice.pdf');
                    let filePDF = fs.createReadStream(pathFile);
                    filePDF.pipe(res);
                    
                } else {
                    let err = new Error(message);
                    err.httpStatusCode = 500;
                    return next(err);
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // USER ORDER
    async order(req, res, next) {
        try {
            let { user } = req;

            if(user) {
            await ServiceOrder.order({model: user}, (information) => {
                let { status, message, error } = information;
                if(status) {
                    return res.redirect("/order");

                } else {
                    return res.redirect("/cart");
                }
            })
            } else {
                return res.redirect("/access/signin");
            }

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // USER PAYMENT ORDER
    async payment(req, res, next) {
        try {
            let { user } = req;
            await ServicePayment.payment({model: user}, (information) => {
                let { status, message, link, error } = information;

                if(status) {
                    res.redirect(link);

                } else {
                    res.redirect("/order");
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

    // CANCEL ORDER
    async cancelOrder(req, res, next) {
        try {
            let { user } = req;

            await ServiceOrder.cancel({model: user}, (information) => {
                let { status, message, error } = information;
                if(status) {
                    return res.redirect("/order");

                } else {
                    let err = new Error(message);
                    err.httpStatusCode = 500;
                    return next(err);
                }
            })

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }

}

module.exports = new ControllerOrder();