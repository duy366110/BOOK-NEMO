const ModelUser = require("../model/model-user");
class MiddlewareUser {

    constructor() { }

    userExists = (req, res, next) => {
        let { email } = req.body;

        ModelUser.findOne({email: {$eq: email}})
        .then((user) => {
            if(!user) {
                next();

            } else {
                res.status(400).json({status: false, message: 'User already'});
            }
        })
        .catch((error) => {
            res.status(400).json({status: false, error});

        })
    }

}

module.exports = new MiddlewareUser();