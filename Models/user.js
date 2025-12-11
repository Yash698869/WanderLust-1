//Building Auth
// Models/user.js
// Models/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ✅ Use .default here, this is what your debug proved
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// ✅ Now a function is passed, not the whole object
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);



//Note->passport-local-mongoose adds automatic Username and pass to our schema 
//plus it adds hashed pass and salt value also