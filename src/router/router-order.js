const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status(200).json({status: true, message: 'Router order'});
})

module.exports = router;