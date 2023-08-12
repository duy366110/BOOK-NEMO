const environment = require("../../environment");
const ModelProduct = require("../model/model-product");

class MiddlewareAmount {

    constructor() { }

    // THỰC HIỆN ĐẾM SỐ 
    getProductAmount = async(req, res, next) => {
        try {

            // THỰC HIỆN ĐẾM SỐ SẢN PHẨM HIỆN CÓ
            let amount = await ModelProduct.find({}).count().exec();

            // TÍNH SỐ TRANG DỰA VÀO SỐ LƯỢNG SẢN PHẨM HIỆN CÓ
            let quantityPage = Math.ceil(amount / environment.pagination.pageProduct.quantityItemOfPage);

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
}

module.exports = new MiddlewareAmount();