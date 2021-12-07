const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: [String]
    },
    price: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);