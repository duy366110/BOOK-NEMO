class ControllerHome {

    constructor() { }

    renderPageHome = (req, res, next) => {
        res.render('pages/page-home', {});
    }
}

module.exports = new ControllerHome();