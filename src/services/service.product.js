"use strict"
const ModelProduct = require("../model/model-product");
const cloudinary = require("../utils/util-cloudinary");
const CONFIG_CLOUDINARY = require("../configs/config.cloudinary");

class ServiceProduct {

    constructor() { }

    // GET PRODUCTS
    async getProducts(limit, skip, cb) {
        try {
            let products = await ModelProduct.find({}).limit(limit).skip(skip).sort({createDate: 'desc'}).lean();
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

    // GET PRODUCT BY ID
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

    // CREATE PRODUCT
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

    // UPDATE PRODUCT
    async update(product = {}, cb) {
        try {

            product.model.title = product.title;
            product.model.price = product.price;
            product.model.quantity = product.quantity;
            product.model.description = product.description;
            product.model.updateDate = new Date().toISOString();

            if(product.image) {
                let imagePath = product.model.image.split("/");
                let image = imagePath[(imagePath.length - 1)].split(".")[0];
                let status = await cloudinary.exists(`${CONFIG_CLOUDINARY.DIRECTORY}/${image}`);

                if(status) {
                    await cloudinary.destroy(`${CONFIG_CLOUDINARY.DIRECTORY}/${image}`);
                    product.model.image = product.image;
                }
            }

            await product.model.save();
            cb({status: true, message: 'Update product information successfully'});

        } catch (err) {
            // PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', err});
        }
    }

    // DELETE PRODUCT
    async delete(product = {}, cb) {
        try {
            if(product.model.image) {
                let imagePath = product.model.image.split("/");
                let image = imagePath[(imagePath.length - 1)].split(".")[0];
                let status = await cloudinary.exists(`${CONFIG_CLOUDINARY.DIRECTORY}/${image}`);

                if(status) {
                    await cloudinary.destroy(`${CONFIG_CLOUDINARY.DIRECTORY}/${image}`);
                }

                await product.model.deleteOne();
                cb({status: true, message: 'Delete product successfully'});
            }

        } catch (err) {
             // PHƯƠNG THỨC LỖI
             cb({status: false, message: 'Method failed', err});
        }
    }

}

module.exports = new ServiceProduct();