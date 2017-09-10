var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(require("passport-local-mongoose"));

module.exports = mongoose.model("User", userSchema);