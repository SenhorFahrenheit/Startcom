const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../schemas/user_schemas");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use 'passwordHash' here to match the schema
    const newUser = new User({ name, email, passwordHash: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Error in /register route:", err); // logs full error
    res.status(500).json({ error: "Internal server error." });
  }
});


module.exports = router;
