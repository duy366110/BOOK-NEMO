"use strict"
const ModelUser = require("../model/model-order");
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

                        await user.model.order.save();

                    } else {
                        user.model.order.collections.push(cartElm);
                    }

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
}

module.exports = new ServiceOrder();