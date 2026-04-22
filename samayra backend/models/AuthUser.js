const mongoose = require("mongoose");

const authUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

module.exports = mongoose.model("AuthUser", authUserSchema);