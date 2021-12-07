const router = require('express').Router();

const authController = require('../controllers/auth/authController');

const authentication = require('../utils/authentication');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authentication.authenticateToken, authController.logout);
router.post('/refresh_token', authController.refreshToken);
router.post('/password', authentication.authenticateToken, authController.changePassword);

module.exports = router;