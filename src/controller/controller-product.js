const ModelProduct = require("../model/model-product");
class ControllerProduct {

    constructor() { }

    renderPageNewProduct = (req, res, next) => {
        res.render("pages/admin/page-admin-new-product.ejs", {
            title: 'Thêm mới sản phẩm',
            path: 'them-san-pham'
        })
    }

    fetchProduct = (req, res, next) => { }

    fetchProductById = (req, res, next) => { }

    saveProduct = (req, res, next) => {
        let { title, image, price, description} = req.body;

        ModelProduct.create({title, image, price, description})
        .then((product) => {
            if(product) {
                res.redirect("/");

            } else {
                
            }

        })
        .catch((error) => {
            throw error;

        })

    }

    updateProduct = (req, res, next) => { }

    deleteProduct = (req, res, next) => { }
}

module.exports = new ControllerProduct();