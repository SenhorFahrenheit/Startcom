const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../schemas/user_schemas");

const router = express.Router();

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure user input

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document with hashed password
    // Note: using 'passwordHash' to match the schema definition
    const newUser = new User({ name, email, passwordHash: hashedPassword });
    await newUser.save(); // Save user to the database

    // Send success response
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    // Log the error for debugging
    console.error("Error in /register route:", err);

    // Send a generic server error response
    res.status(500).json({ error: "Internal server error." });
  }
});

// Export the router so it can be used in the main app
module.exports = router;
