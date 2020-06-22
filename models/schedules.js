const mongoose = require('mongoose'),
    scheduleSchema = new mongoose.Schema({
        year: String,
        semester: String,
        image: String,
        studyyear: String
    })
module.exports = mongoose.model("schedule", scheduleSchema);