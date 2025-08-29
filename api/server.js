// Importing dependencies
const express = require("express");
const session = require("express-session");
const config = require("dotenv").config();
const {connectDB, mongoose} = require("./config/db");
const mongoStore = require("connect-mongo");


// Creating the application
const app = express();

// Middleware to allow JSON in request bodies
app.use(express.json());

// Middleware for session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fr@se-segur4-123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: (1000 * 60 * 60 * 24 * 30),
    },
    store: mongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: 'sessao', 
      ttl: (60 * 60 * 24 * 30),
      autoRemove: 'native',
    }),
  })
);

// Server port
const PORT = process.env.PORT;

// Connecting to database
connectDB();

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
