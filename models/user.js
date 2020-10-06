const mongoose = require('mongoose');

//User Model
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
  });
  const User = mongoose.model("Users", userSchema);

  exports.userSchema = userSchema;
  exports.User = User;
  