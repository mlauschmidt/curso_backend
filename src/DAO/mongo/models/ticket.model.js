const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: [],
        required: true
    }
})

const ticketModel = mongoose.model('tickets', ticketSchema);

module.exports = ticketModel;