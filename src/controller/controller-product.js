const ModelProduct = require("../model/model-product");
const cloudinary = require("../utils/util-cloudinary");
const path = require('path');
const fs = require('fs');
class ControllerProduct {

    constructor() { }

    fetchProduct = (req, res, next) => { }

    fetchProductById = (req, res, next) => { }

    updateProduct = (req, res, next) => { }

    // ADMIN XOÁ SẢN PHẨM
    deleteProduct = async (req, res, next) => {
        try {
            let { product } = req.params;

            let productInfor = await ModelProduct.findById(product);


            let imagePath = productInfor.image.split("/");
            let image = imagePath[(imagePath.length - 1)].split(".")[0];

            // XOÁ ẢNH SẢN PHẨM TRƯỚC KHI XOÁ SẢN PHẨM
            cloudinary.destroy(`book_nemo/${image}`, async (status) => {
                console.log(status);
                let { deleted } = status;

                // XOÁ ẢNH SẢN PHẨM THÀNH CÔNG - XOA SẢN PHẨM
                if(deleted) {
                    await productInfor.deleteOne();
                    res.redirect("/admin");
                }

            })


        } catch (err) {
            let error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
}

module.exports = new ControllerProduct();