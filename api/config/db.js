const mongoose = require("mongoose");

// Function responsible for connecting to MongoDB
async function connectDB() {
  try {
    // Try to connect using the MongoDB URI stored in the .env file
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // ensures compatibility with the new MongoDB URL parser
      useUnifiedTopology: true,   // uses the new connection management engine
    });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    // If the connection fails, log the error and terminate the application
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
}

// Export the function and mongoose instance for use in server.js (or other files)
module.exports = { connectDB, mongoose };
