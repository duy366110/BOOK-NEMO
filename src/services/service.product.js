"use strict"
const ModelProduct = require("../model/model-product");

class ServiceProduct {

    constructor() { }

    async getProducts(limit, skip, cb) {
        try {
            let products = await ModelProduct.find({}).limit(limit).skip(skip).lean();
            products = products.map((product) => {
                product.price = Number(product.price).toFixed(3);
                return product;
            })

            cb({status: true, message: 'Get product successfully', products});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }

    }

    async getById(id, cb) {
        try {
            let product = await ModelProduct.findById(id).lean();
            product.price = Number(product.price).toFixed(3);

            cb({status: true, message: 'Get product successfully', product});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    async create(product = {}, cb) {
        try {
            let productInfor = await ModelProduct.create({
                title: product.title,
                image: product.image,
                price: product.price,
                quantity: product.quantity,
                description: product.description
            })

            if(productInfor) {
                cb({status: true, message: 'Create product successfully'});

            } else {
                cb({status: false, message: 'Create product unsuccessfully'});
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

}

module.exports = new ServiceProduct();