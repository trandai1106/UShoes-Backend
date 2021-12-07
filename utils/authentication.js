const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports.authenticateToken = async (req, res, next) => {
    try {
        // Check if req.headers.authorization exist
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: 0,
                message: 'Required token!'
            });
        }

        // Get access token from request headers
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({
                status: 0,
                message: 'Required token!'
            });
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                return res.status(400).json({
                    status: 0,
                    message: 'Invalid token!'
                });
            }

            // Check the payload
            const _user = await User.findOne({
                _id: payload._id
            });

            if (!_user) {
                return res.status(403).json({
                    status: 0,
                    message: 'Invalid token!'
                });
            }
            
            req.user = _user;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
}