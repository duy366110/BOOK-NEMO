"use strict"
const pdfkitTable = require("pdfkit-table");
const path = require('path');
const fs = require("fs");
const ModelOrder = require("../model/model-order");

class ServiceOrder {

    constructor() { }

    // GET BY ID ORDER
    async getOrderById(user = {}, cb) {
        try {

            let order = await ModelOrder
                        .findOne({user: {$eq: user.id}})
                        .populate(['user', 'collections.product'])
                        .lean();

            cb({status: true, message: 'Get order user successfully', order});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }
    
    // ORDER
    async order(user = {}, cb) {
        try {
            if(user.model.order) {
                user.model.cart = user.model.cart.map( async(cartElm) => {

                    if(user.model.order.collections.some((colElm) => colElm.product.toString() === cartElm.product._id.toString())) {
                        user.model.order.collections = user.model.order.collections.map((colElm) => {
                            if(colElm.product.toString() === cartElm.product._id.toString()) {
                                colElm.quantity += cartElm.quantity;
                            }

                            return colElm;
                        })

                    } else {
                        user.model.order.collections.push(cartElm);
                    }

                    await user.model.order.save();
                    return null;
                })

            } else {
                let order = await ModelOrder.create({
                    user: user.model,
                    collections: user.model.cart
                })

                user.model.order = order;
            }

            if(user.model.cart.length) {
                user.model.cart = user.model.cart.map((cartElm)=> null).filter((cartElm) => cartElm);
            }

            await user.model.save();
            cb({status: true, message: "User order product successfully"});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CANCEL ORDER
    async cancel(user = {}, cb) {
        try {
            user.model.order.collections.map(async (colElm) => {
                colElm.product.quantity += colElm.quantity;

                if(colElm.product.ref) {
                    colElm.product.ref--;
                }

                await colElm.product.save();

                return colElm;
            })

            await user.model.order.deleteOne();
            user.model.order = null;
            await user.model.save();
            cb({status: true, message: 'Cancel user order successfully'});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CREATE INVOICE
    async invoice(user = {}, res = {}, cb) {
        try {
            if(user.model) {
                const doc = new pdfkitTable({ margin: 30, size: 'A4', encodeURI: 'UTF-8' });

                let pathFont = path.join(__dirname,'../', 'public', 'fonts', 'Roboto-Regular.ttf' )

                doc.font(pathFont);
                doc.pipe(fs.createWriteStream(path.join(__dirname, "../", "document", 'invoice.pdf')));
                doc.pipe(res);

                doc.fontSize(18).text('HOÁ ĐƠN KHÁCH HÀNG', {width: 535, align: 'center'});

                let total = Number(
                    user.model.order.collections.reduce((acc, order) => {
                        acc += parseFloat(order.product.price) * Number(order.quantity);
                        return acc;
                    }, 0)
                ).toFixed(3);

                let rowsInfor = [
                    ['Họ và tên', `${user.model.name}`],
                    ['E-mail', `${user.model.email}`],
                    ['Tổng hoá đơn', `${total} VND`]
                ]

                let rowsProduct = [
                   ...user.model.order.collections.map((order, index) => {
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
                cb({status: true, message: 'Create voice successfully'});

            } else {
                cb({status: false, message: 'Create voice unsuccessfully'});
            }

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceOrder();