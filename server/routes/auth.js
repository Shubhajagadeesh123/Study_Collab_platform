const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

// --- LOGIN ROUTE (The Fix) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });

    // SENDING THE USERNAME BACK TO FRONTEND
    res.json({
      token,
      username: user.username, // This ensures frontend gets the real name
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;