const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'products' 
                },
                quantity: Number,
                subtotal: Number
            }
        ],
        /* default: [] */
    },
    total: {
        type: Number,
        default: 0
    }
})

const cartModel = mongoose.model('carts', cartSchema);

module.exports = cartModel;