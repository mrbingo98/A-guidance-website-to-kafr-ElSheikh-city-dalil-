const mongoose = require('mongoose');
var restSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    map: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            index: true,
            unique: true,
            required: true
        },
        username: {
            type: String,
            index: true,
            unique: true,
            required: true
        }
    },
    phone: Number,
    openTime: Number,
    closeTime: Number,
    menu: String,
    image: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restpost"
    }]
});


module.exports = mongoose.model("restaurant", restSchema);