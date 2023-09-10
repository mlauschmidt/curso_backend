const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;