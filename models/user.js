const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

// Add username, hash & salt fields, plus helper methods
userSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model("User", userSchema);
