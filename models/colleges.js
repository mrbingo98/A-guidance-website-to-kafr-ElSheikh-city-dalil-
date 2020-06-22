const mongoose = require('mongoose'),
    collegeSchema = new mongoose.Schema({
        name: String,
        details: String,
        depts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "department"
        }],
        admin: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            username: String
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "colpost"
        }],
        image: String,
        map: String
    });
module.exports = mongoose.model("college", collegeSchema);