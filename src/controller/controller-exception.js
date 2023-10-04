"use strict"
class ControllerException {

    constructor() { }

    //RENDER NOT FOUND PAGE
    renderNotFoundPage = (req, res, next) => {
        res.render('pages/exception/404', {});
    }

    //RENDER EXECPTION PAGE
    renderinternalServerFailed = (error, req, res, next) => {
        res.render('pages/exception/500', {});
    }
}

module.exports = new ControllerException();