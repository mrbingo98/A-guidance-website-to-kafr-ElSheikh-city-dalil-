const mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({
        fname: String,
        lname: String,
        email: {
            type: String,
            index: true,
            unique: true,
            required: true
        },
        username: {
            type: String,
            index: true,
            unique: true,
            minlength: 2,
            maxlength: 16,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        phone: Number,
        bod: Date,
        sex: String,
        isVerified: { type: Boolean, default: false }
    })
module.exports = mongoose.model("user", userSchema);