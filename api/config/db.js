const mongoose = require("mongoose");

// Function responsible for connecting to MongoDB
async function connectDB() {
  try {
    // Attempt to connect using the URI from .env
await mongoose.connect(process.env.MONGO_URI); // garante que process.env.MONGO_URI está correto

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    // If connection fails, log the error and exit the app
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
}

// Export the function so it can be used in server.js
module.exports = connectDB;
