const mongoose = require('mongoose'),
    colPostSchema = new mongoose.Schema({
        body: {
            type: String,
            required: true
        }
    })
module.exports = mongoose.model('colpost', colPostSchema)