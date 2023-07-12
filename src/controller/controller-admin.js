const ModelProduct = require("../model/model-product");

class ControllerAdmin {

    constructor() { }

    renderPageAdmin = (req, res, next) => {
        ModelProduct.find({})
        .then((products) => {
            res.render('pages/admin/page-admin', {
                title: 'Quản trị',
                path: 'Quan-tri',
                products
            });
        })
        .catch((error) => {
            throw error;

        })
    }

    renderPageEditProduct = (req, res, next) => {
        res.render('pages/admin/product/page-admin-edit-product', {
            title: 'Chỉnh sửa thông tin sản phẩm',
            path: 'Quan-tri'
        })
    }

    renderPageNewProduct = (req, res, next) => {
        res.render("pages/admin/product/page-admin-new-product", {
            title: 'Thêm mới sản phẩm',
            path: 'Quan-tri'
        })
    }

    saveProduct = (req, res, next) => {
        let { title, image, price, description} = req.body;

        ModelProduct.create({title, image, price, description})
        .then((product) => {
            if(product) {
                res.redirect("/");

            }

        })
        .catch((error) => {
            throw error;

        })

    }
}

module.exports = new ControllerAdmin();