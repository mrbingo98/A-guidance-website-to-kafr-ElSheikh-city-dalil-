const mongoose = require('mongoose');
var trainSchema = new mongoose.Schema({
    departure: String,
    arrival: String,
    no: Number,
    dep_time: Number,
    arr_time: Number,
    type: String,
    price: String
});
module.exports = mongoose.model("train", trainSchema);