const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    refresh_token: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('User', userSchema);