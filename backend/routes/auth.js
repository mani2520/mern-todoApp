const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendMail");
const validateEmail = require("../utils/validateEmail");

const setOtp = require("../utils/setOtp");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { valid, message } = validateEmail(email);
    if (!valid) return res.status(400).json({ message });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
    });

    const otp = setOtp(user, "email");
    await user.save();

    await sendEmail(email, "verify your account", `Your OTP is ${otp}`);

    res.json({ message: "Registered successfully, check your email for OTP" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
});

router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.emailOTP !== otp || user.emailOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or Expire OTP" });
  }
  (user.isVerified = true),
    (user.emailOTP = undefined),
    (user.emailOTPExpire = undefined),
    await user.save();

  res.json({ message: "Email verified successfully" });
});

router.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid User" });

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Email not verified, Please verify your email first",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

router.post("/logout", authMiddleware, async (req, res) => {
  res.json({ message: "Loged out successfully" });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch)
      return res.status(400).json({ message: "old password is incorrect" });

    const hashed = await bcrypt.hased(newPassword, 10);
    req.user.password = hashed;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const { valid, message } = validateEmail(email);
    if (!valid) return res.status(400).json({ message });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = setOtp(user, "reset");

    await user.save();

    await sendEmail(user.email, "Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== otp || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }
    const hased = await bcrypt.hash(newPassword, 10);
    user.password = hased;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const { valid, message } = validateEmail(email);
    if (!valid) return res.status(400).json({ message });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const otp = setOtp(user, "email");
    await user.save();

    await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);
    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-email", async (req, res) => {
  try {
    const { oldEmail, newEmail } = req.body;

    const { valid, message } = validateEmail(newEmail);
    if (!valid) return res.status(400).json({ message });

    const user = await User.findOne({ email: oldEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.email = newEmail;
    user.isVerified = false;

    const otp = setOtp(user, "email");
    await user.save();

    await sendEmail(newEmail, "Verify your new email", `Your OTP is ${otp}`);
    res.json({ message: "Email updated. Please verify new Email" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
});

module.exports = router;
