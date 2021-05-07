const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notes: { type: Array, default: [] }
});

module.exports = mongoose.model("User", userSchema);