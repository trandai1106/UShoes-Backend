const router = require('express').Router();

const authentication = require('../utils/authentication');

router.get('/product/list', authentication.authenticateToken, )

module.exports = router;