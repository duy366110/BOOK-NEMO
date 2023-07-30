const ModelProduct = require("../model/model-product");
const cloudinary = require("../utils/util-cloudinary");
const path = require('path');
const fs = require('fs');
class ControllerProduct {

    constructor() { }

    fetchProduct = (req, res, next) => { }

    fetchProductById = (req, res, next) => { }

    // ADMIN CREATE SẢN PHẨM
    createProduct = async (req, res, next) => {
        let { title, image, price, description} = req.body;
        let { file } = req;
        let isRole  = req.session.role;
        const { errors } = validationResult(req);

        if(errors.length) {
            res.render("pages/admin/product/page-admin-new-product", {
                title: 'Thêm mới sản phẩm',
                path: 'Quan-tri',
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : 'Client',
                csurfToken: req.csrfToken(),
                formError: req.flash('error'),
                inputsErrors: errors,
                formField: { title, image, price, description }
            })

        } else {
            try {
                let pathImage = '';
                if(file) {
                    pathImage = file.path? file.path : '';
                }

                let product = await ModelProduct.create({title, image: pathImage, price, description});
                if(product) res.redirect("/");

            } catch (err) {
                let error = new Error('');
                error.httpStatusCode = 500;
                return next(error);
            }
        }
    }

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