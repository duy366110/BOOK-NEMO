const environment = require("../../environment");
const ModelProduct = require("../model/model-product");

class MiddlewareAmount {

    constructor() { }

    // THỰC HIỆN ĐẾM SỐ 
    getProductAmount = async(req, res, next) => {
        try {

            let amount = await ModelProduct.find({}).count().exec();
            req.paginations = Array.from({length: Math.ceil(amount / environment.pagination.pageProduct.quantityItemOfPage)}, (elm, index) => index);
            next();

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new MiddlewareAmount();