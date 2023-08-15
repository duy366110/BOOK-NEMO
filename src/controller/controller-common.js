const ModelProduct = require("../model/model-product");
const environment = require("../../environment");
const utilpagination = require("../utils/util-pagination");
class ControllerCommon {

    constructor() { }

    //  RENDER TRANG CHỦ
    renderPageHome = async (req, res, next) => {
        
        try {
            let { infor } = req.session;
            let products = await ModelProduct.find({}).limit(35).skip(0).exec();

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

            // KIỂM TRA SỐ LƯỢNG TRANG CÓ LỚN HƠN 1
            if(paginations.length) {
                page = utilpagination.methodPagination(page, paginations);
            }

            // THỰC HIỆN LẤY SẢN THEO YÊU VỀ SỐ LƯỢNG
            let products = await ModelProduct.find({})
            .limit(environment.pagination.quantityItemOfPage)
            .skip(environment.pagination.quantityItemOfPage * page)
            .exec();

            // FORMAT GIÁ SẢN PHẨM
            products = products.map((product) => {
                product.price = Number(product.price).toFixed(3);
                return product;
            })

            // RENDER TRANG SẢN PHẨM PHÍA NGƯỜI DÙNG
            res.render('pages/shop/page-product', {
                currentPage: Number(page),
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