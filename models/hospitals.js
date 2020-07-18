const mongoose = require('mongoose');
var hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    map: String,
    admin: {
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
    website: String,
    image: String,
});


module.exports = mongoose.model("hospital", hospitalSchema);