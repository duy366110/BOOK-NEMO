const ModelProduct = require("../model/model-product");

class ControllerAdmin {

    constructor() { }

    renderPageAdmin = (req, res, next) => {
        ModelProduct.find({})
        .then((products) => {
            res.render('pages/admin/page-admin', {
                title: 'Quản trị sản phẩm',
                path: 'Quan-tri',
                products,
                isUser: req.cookies.user? true : false
            });
        })
        .catch((error) => {
            throw error;

        })
    }

    renderPageAdminUser = (req, res, next) => {
        res.render('pages/admin/page-admin-user', {
            title: 'Quản trị người dùng',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false
        });
    }

    renderPageAdminRole = (req, res, next) => {
        res.render('pages/admin/page-admin-role', {
            title: 'Quản trị quyển qaunr trị',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false
        });
    }

    renderPageEditProduct = (req, res, next) => {
        let { product } = req.query;

        ModelProduct.findById(product)
        .then((product) => {
            res.render('pages/admin/product/page-admin-edit-product', {
                title: 'Chỉnh sửa thông tin sản phẩm',
                path: 'Quan-tri',
                product: product? product : null,
                isUser: req.cookies.user? true : false
            })
        })
        .catch((error) => {
            throw error;

        })
    }

    renderPageNewProduct = (req, res, next) => {
        res.render("pages/admin/product/page-admin-new-product", {
            title: 'Thêm mới sản phẩm',
            path: 'Quan-tri',
            isUser: req.cookies.user? true : false
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

    editProduct = (req, res, next) => {
        let {product, title, image, price, description} = req.body;

        ModelProduct.findById(product)
        .then((product) => {
            product.title = title;
            product.image = image;
            product.price = price;
            product.description = description;
            return product.save();

        })
        .then((product) => {
            if(product) {
                res.redirect('/admin');

            }

        })
        .catch((error) => {
            throw error;

        })
    }
}

module.exports = new ControllerAdmin();