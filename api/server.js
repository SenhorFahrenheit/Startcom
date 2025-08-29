// Importing dependencies
const express = require("express");
const config = require("dotenv").config();
const connectDB = require("./config/db")


// Creating the application
const app = express();

// Middleware to allow JSON in request bodies
app.use(express.json());

// Server port
const PORT = process.env.PORT || 3000;

// Connecting to database
connectDB()

const userRoutes = require("./routes/user/user_routes");
app.use("/api/users", userRoutes);

// Example GET route
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully!");
});

// Starting the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
