const ModelProduct = require("../model/model-product");
class ControllerHome {

    constructor() { }

    renderPageHome = async (req, res, next) => {
        
        try {
            let { infor } = req.session;
            let products = await ModelProduct.find({});

            res.render('pages/shop/page-home', {
                title: 'Trang chủ',
                path: 'Trang-chu',
                products,
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                footer: true
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
            
        }
    }
}

module.exports = new ControllerHome();