"use strict"
const ModelTransaction = require("../model/model-transaction");

class ServiceTransaction {

    constructor() { }

    async getTransactions(user = {}, cb) {
        try {
            let transactions = await ModelTransaction
            .find({user: {$eq: user.model._id}})
            .sort({createDate: 'desc'})
            .populate([
                'user',
                {
                    path: 'user',
                    model: 'users'
                },
                {
                    path: 'collections',
                    populate: {
                        path: 'product',
                        model: 'products'
                    }
                }
            ])
            .lean();

            if(transactions.length) {
                transactions = transactions.map((transaction) => {
                    transaction.total = transaction.collections.reduce((acc, elm) => {
                        return acc += Number(elm.product.price) * Number(elm.quantity);
                    }, 0)
                    return transaction;
                })
            }

            cb({status: true, message: 'Get transactions successfully', transactions});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async create(user = {}, payment_id = '', cb) {
        try {
            let transaction  = await ModelTransaction.create({
                user: user.model,
                payment_id,
                collections: user.model.order.collections,
            })

            if(transaction) {
                await user.model.order.deleteOne();
                user.model.order = null;
                user.model.transactions.push(transaction);
                await user.model.save();
                cb({status: true, message: 'Create transaction successfully'});

            } else {
                cb({status: false, message: 'Create transaction unsuccessfully'});
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

}

module.exports = new ServiceTransaction();