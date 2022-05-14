const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isActive:{
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    

});

module.exports = new mongoose.model('User', userSchema);