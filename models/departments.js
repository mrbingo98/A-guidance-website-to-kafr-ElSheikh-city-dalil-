const mongoose = require('mongoose'),
    deptSchema = new mongoose.Schema({
        name: {
            type: String,
            index: true,
            required: true
        },
        details: String,
        schedules: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "schedule"
        }]
    })
module.exports = mongoose.model("department", deptSchema);