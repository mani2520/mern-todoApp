const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: `1d` });
    res.json({ token, username: user.username });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
});

router.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid User" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
