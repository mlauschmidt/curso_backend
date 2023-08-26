const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: Array,
    code: {
        type: Number,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: Boolean
})

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;