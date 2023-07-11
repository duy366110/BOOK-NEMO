const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status(200).json({status: true, message: 'User router'});
})

module.exports = router;