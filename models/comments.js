const mongoose = require('mongoose'),
    commentSchema = new mongoose.Schema({
        text: String,
        auther: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            username: String
        }
    })
module.exports = mongoose.model("comment", commentSchema);