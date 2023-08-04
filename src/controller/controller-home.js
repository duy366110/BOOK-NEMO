const ModelProduct = require("../model/model-product");
class ControllerHome {

    constructor() { }

    renderPageHome = async (req, res, next) => {
        
        try {
            let isRole  = req.session.role;
            let products = await ModelProduct.find({});

            res.render('pages/shop/page-home', {
                title: 'Trang chủ',
                path: 'Trang-chu',
                products,
                isLogin: req.cookies.user? true : false,
                isRole:  isRole? isRole : '',
                csurfToken: req.csrfToken(),
            });

        } catch (err) {
            let error = Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
            
        }
    }
}

module.exports = new ControllerHome();