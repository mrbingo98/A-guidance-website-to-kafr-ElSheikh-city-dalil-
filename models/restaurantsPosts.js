const mongoose = require('mongoose'),
    restPostSchema = new mongoose.Schema({
        body: {
            type: String,
            required: true
        }
    })
module.exports = mongoose.model('restpost', restPostSchema)