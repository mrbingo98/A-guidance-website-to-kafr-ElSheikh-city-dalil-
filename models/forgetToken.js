const mongoose = require('mongoose');
const forgetTokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 7200 }
});
module.exports = mongoose.model("forgettoken", forgetTokenSchema);