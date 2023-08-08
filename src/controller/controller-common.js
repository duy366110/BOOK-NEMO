const ModelProduct = require("../model/model-product");
class ControllerCommon {

    constructor() { }

    //  RENDER TRANG CHỦ
    renderPageHome = async (req, res, next) => {
        
        try {
            let { infor } = req.session;
            let products = await ModelProduct.find({});

            products = products.map((product) => {
                product.price = Number(product.price).toFixed(3);
                return product;
            })

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

    // RENDER TRANG GIỚI THIỆU
    renderPageIntroduction = async (req, res, next) => {
        let { infor } = req.session;

        res.render("pages/shop/page-introduction", {
            title: 'Giới thiệu',
            path: 'Gioi-thieu',
            infor: infor? infor : null,
            csurfToken: req.csrfToken(),
            footer: true
        });
    }
}

module.exports = new ControllerCommon();