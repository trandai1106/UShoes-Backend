const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports.register = async (req, res) => {
    try {
        // Get data sent
        const { phone, name, password } = req.body;

        // Check required data

        // Check if the account exists
        var checkAccount = await User.findOne({ phone: phone });
        if (checkAccount) {
            return res.status(400).json({
                status: 0,
                message: 'The phone number already exist!'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(password, salt);

        // Create new document
        await User.create({
            phone: phone,
            name: name,
            password: passwordHashed
        });

        var account = await User.findOne({ phone: phone });

        // Generate new tokens
        const accessToken = jwt.sign(
            { _id: account._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: 60 * 60 }
        );
        const refreshToken = jwt.sign(
            { _id: account._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: 24 * 60 * 60 }
        );
        
        // Update refresh token in database
        account.refresh_token = refreshToken;
        await account.save();

        // Response
        return res.status(201).json({
            status: 1,
            message: 'Register successfully!',
            data: {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        // Get data sent
        const { phone, password, role } = req.body;

        // Check required data

        // Check if the account exists
        var checkAccount = await User.findOne({ 
            phone: phone,
            role: role 
        });
        if (!checkAccount) {
            return res.status(400).json({
                status: 0,
                message: 'Phone number does not exist!'
            });
        }
        
        // If the account exists, check password
        if (!await bcrypt.compare(password, checkAccount.password)) {
            return res.status(400).json({
                status: 0,
                message: 'Incorrect password!'
            });
        }
        
        // Generate new tokens
        const accessToken = jwt.sign(
            { _id: checkAccount._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: 60 * 60 }
        );
        const refreshToken = jwt.sign(
            { _id: checkAccount._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: 24 * 60 * 60 }
        );
        
        // Update refresh token in database
        checkAccount.refresh_token = refreshToken;
        await checkAccount.save();

        // Response
        return res.status(201).json({
            status: 1,
            message: 'Login successfully!',
            data: {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
};

module.exports.logout = async (req, res) => {
    try {
        // Delete refresh_token in database
        await User.updateOne(
            { _id: req.user._id },
            { refresh_token: "" }
        );

        return res.status(200).json({
            status: 1,
            message: 'Logout successfully!'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
};

module.exports.refreshToken = async (req, res) => {
    try {
        // Get refresh token sent
        const { refresh_token } = req.body;

        if (!refresh_token) return res.status(403).json({
            status: 0,
            message: 'Invalid refresh token!'
        });

        // Validate refresh token
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                console.log(err);
                return res.status(403).json({
                    status: 0,
                    message: 'Invalid refresh token!'
                });
            }

            // Find in database with _id
            const _user = await User.findOne({
                _id: payload._id
            });
            if (!_user) {
                return res.status(403).json({
                    status: 0,
                    message: 'Invalid refresh token!'
                });
            }

            // Compare with refresh token in database
            if (_user.refresh_token != refresh_token) {
                return res.status(403).json({
                    status: 0,
                    message: 'Invalid refresh token!'
                });
            } 

            // Create new access token
            const accessToken = jwt.sign(
                { _id: _user._id }, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: 60 * 60 }
            );

            return res.status(200).json({
                data: {
                    access_token: accessToken,
                },
                status: 1,
                message: "Refresh token successfully!"
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        // Get data sent
        const oldPassword = req.body.old_password; 
        const newPassword = req.body.new_password;

        // Check required data
        
        // Check password
        const checkAccount = await User.findById(req.user._id);
        if (!await bcrypt.compare(oldPassword, checkAccount.password)) {
            return res.status(400).json({
                status: 0,
                message: 'Incorrect password!'
            });
        }
        
        // If password is right
        // Hash password
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(newPassword, salt);

        // Generate new tokens
        const accessToken = jwt.sign(
            { _id: checkAccount._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: 60 * 60 }
        );
        const refreshToken = jwt.sign(
            { _id: checkAccount._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: 24 * 60 * 60 }
        );
        
        // Update refresh token in database
        checkAccount.refresh_token = refreshToken;
        checkAccount.password = passwordHashed;
        await checkAccount.save();

        // Response
        return res.status(201).json({
            status: 1,
            message: 'Change password successfully!',
            data: {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 0,
            message: 'Unknown error!'
        });
    }
}