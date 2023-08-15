const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'products' 
                },
                quantity: Number
            }
    ],
    default: []
    }
})

const cartModel = mongoose.model('carts', cartSchema);

module.exports = cartModel;