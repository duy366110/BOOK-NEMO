const ModelProduct = require("../model/model-product");
class ControllerHome {

    constructor() { }

    renderPageHome = (req, res, next) => {
        ModelProduct.find({})
        .then((products) => {

            res.render('pages/shop/page-home', {
                title: 'Trang chủ',
                path: 'Trang-chu',
                products
            });

        })
        .catch((error) => {
            throw error;

        })
    }
}

module.exports = new ControllerHome();