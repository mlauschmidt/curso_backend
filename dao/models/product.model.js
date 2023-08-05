const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    /* id: {
        type: Number,
        unique: true
    }, */
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnail: Array,
    code: {
        type: Number,
        unique: true
    },
    stock: Number,
    status: Boolean
})

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;