const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
    verified: { type: Boolean, default: false },
    emailOTP: String,
    emailOTPExpire: Date,
    resetOTP: String,
    resetOTPExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
