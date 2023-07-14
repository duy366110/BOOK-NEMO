const ModelProduct = require("../model/model-product");
class ControllerHome {

    constructor() { }

    renderPageHome = async (req, res, next) => {
        try {
            let products = await ModelProduct.find({});

            res.render('pages/shop/page-home', {
                title: 'Trang chủ',
                path: 'Trang-chu',
                products,
                isUser: req.cookies.user? true : false
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
            
        }
    }
}

module.exports = new ControllerHome();