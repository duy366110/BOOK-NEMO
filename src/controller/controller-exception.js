class ControllerException {

    constructor() { }

    renderNotFoundPage = (req, res, next) => {
        res.render('pages/exception/404', {});
    }

    renderinternalServerFailed = (error, req, res, next) => {
        res.render('pages/exception/500', {});
    }
}

module.exports = new ControllerException();