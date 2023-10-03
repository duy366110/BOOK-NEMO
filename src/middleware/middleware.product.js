"use strict"
const environment = require("../../environment");
const ModelProduct = require("../model/model-product");

class MiddlewareProduct {

    constructor() { }

    // THỰC HIỆN ĐẾM SỐ 
    getProductAmount = async(req, res, next) => {
        try {

            // THỰC HIỆN ĐẾM SỐ SẢN PHẨM HIỆN CÓ
            let amount = await ModelProduct.find({}).count().exec();

            // TÍNH SỐ TRANG DỰA VÀO SỐ LƯỢNG SẢN PHẨM HIỆN CÓ
            let quantityPage = Math.ceil(amount / environment.pagination.quantityItemOfPage);

            // TRƯỜNG HỢP TRANG CHỈ CÓ 1
            if(quantityPage <= 1) {
                req.paginations = [];

            } else {
                // TRƯỜNG HỢP TRANG NHIỀU HƠN 1
                req.paginations = Array.from({length: quantityPage}, (elm, index) => index);
            }

            next();

        } catch (err) {
            // PHƯƠNG THỨC LỖI
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
    
    async findProductById(req, res, next) {
        try {
            let { product } = req.body;
            let productInfor = await ModelProduct.findById(product).exec();
            req.product = productInfor;
            next();

        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new MiddlewareProduct();