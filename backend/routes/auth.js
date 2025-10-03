const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendMail");
const validateEmail = require("../utils/validateEmail");

const setOtp = require("../utils/setOtp");

const TodoModel = require("../models/Todo");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existName = await User.findOne({ username });
    if (existName)
      return res.status(400).json({ message: "User name already taken" });

    const { valid, message } = validateEmail(email);
    if (!valid) return res.status(400).json({ message });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
      verified: false,
    });

    await user.save();

    res.json({
      message: "Registered successfully, Please verify your account",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
});

router.post("/send-verify-otp", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.verified) {
      return res.status(400).json({ message: "Account already verified" });
    }
    const otp = setOtp(user, "email");
    await user.save();

    const message = `
      Hello ${user.username},

      Your OTP is ${otp}.
      It is valid for 10 minutes.

      Do not share it with anyone.
    `;

    await sendEmail(user.email, "Verify your account", message);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-email", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { otp } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP required" });

    if (
      !user.emailOTP ||
      user.emailOTP !== otp ||
      user.emailOTPExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    user.verified = true;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
      email: user.email,
      verified: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid User" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      username: user.username,
      verified: !!user.verified,
      email: user.email,
    });
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

router.post("/send-password-change-otp", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const otp = setOtp(user, "reset");
    await user.save();

    const message = `
    Hello ${user.username},

      Your password change OTP is ${otp}.
      It is valid for 10 minutes.

      Do not share it with anyone.
    `;
    await sendEmail(user.email, "Password change OTP", message);
    res.json({ message: "Password change OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword, otp } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "oldPassword & newPassword required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "old password is incorrect" });

    if (
      !user.resetOTP ||
      user.resetOTP !== otp ||
      user.resetOTPExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    (user.resetOTP = undefined), (user.resetOTPExpire = undefined);
    await user.save();

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

    const emailBodyContent = `
    Hello ${user.username},

    Your OTP is ${otp}. 
    It is valid for 10 minutes.

    Do not share it with anyone.`;

    // await sendEmail(user.email, "Password Reset OTP", emailBodyContent);

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
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
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

    const emailBodyContent = `
    Hello ${user.username},

    Your OTP is ${otp}. 
    It is valid for 10 minutes.

    Do not share it with anyone.`;

    await sendEmail(email, "Verify your account", emailBodyContent);
    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-email", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const newEmail = req.body.newEmail;
    if (!newEmail)
      return res.status(400).json({ message: "newEmail required" });

    const { valid, message } = validateEmail(newEmail);
    if (!valid) return res.status(400).json({ message });

    const existUser = await User.findOne({ email: newEmail });
    if (existUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    user.pendingEmail = newEmail;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;

    const otp = setOtp(user, "email");
    await user.save();

    const emailBodyContent = `
    Hello ${user.username},

    Your OTP is ${otp}. 
    It is valid for 10 minutes.

    Do not share it with anyone.`;

    await sendEmail(newEmail, "Verify your new email", emailBodyContent);
    res.json({ message: "Email updated. Please verify new Email" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
});

router.post("/verify-new-email", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not fount" });

    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP Required" });

    if (
      !user.emailOTP ||
      user.emailOTP !== otp ||
      user.emailOTPExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.verified = true;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;

    await user.save();
    res.json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
});

router.post("/update-name", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Name Required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const existName = await User.findOne({ username: name });
    if (existName && existName._id.toString() !== user._id.toString())
      return res.status(400).json({ message: "User name already taken" });

    user.username = name;
    await user.save();

    res.json({ message: "Name updated", username: user.username });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/delete-otp", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const otp = setOtp(user, "delete");
    await user.save();

    const body = `Hello ${user.username}, Your account delete OTP is ${otp}. Valid for 10 minutes.`;
    await sendEmail(user.email, "Confirm account deletion", body);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/delete-account", authMiddleware, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (
      !user.deleteOTP ||
      user.deleteOTP !== otp ||
      user.deleteOTPExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    await TodoModel.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
