const ModelProduct = require("../model/model-product");
const environment = require("../../environment");
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

    // RENDER TRANG SẢN PHẨM
    renderPageProducts = async(req, res, next) => {
        try {
            let { infor } = req.session;
            let { page } = req.params;
            let { paginations } = req;            

            console.log(page);

            let products = await ModelProduct.find({});
            products = products.map((product) => {
                product.price = Number(product.price).toFixed(3);
                return product;
            })

            res.render('pages/shop/page-product', {
                link: '/products',
                title: 'Sản phẩm',
                path: 'San-pham',
                products,
                infor: infor? infor : null,
                csurfToken: req.csrfToken(),
                paginations, 
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