const mongoose = require("mongoose");

// Define the schema for a User collection
// Each user will have a name, email, and a hashed password
const userSchema = new mongoose.Schema(
  {
    // User's full name (required field, must be a string)
    name: { type: String, required: true },

    // User's email address (required field, must be a string)
    email: { type: String, required: true },

    // Hashed version of the user's password
    // We store the hash instead of the plain text for security reasons
    passwordHash: { type: String, required: true },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to the schema
    timestamps: true,
  }
);

// Export the model so it can be used in other parts of the application
// Arguments: (modelName, schema, collectionName)
// "User" -> name used in the app
// userSchema -> schema definition
// "user" -> collection name in MongoDB
module.exports = mongoose.model("User", userSchema, "user");
