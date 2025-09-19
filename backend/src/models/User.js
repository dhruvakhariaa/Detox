const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // Ensures no two users can have the same username
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no two users can have the same email
    trim: true,
    lowercase: true,
    // Basic regex to validate email format
    match: [/.+\@.+\..+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  // We will link to other models later, but define the fields now
  personalityProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalityProfile', // This tells Mongoose to populate from the PersonalityProfile model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- Mongoose Middleware ('pre-save' hook) ---
// This function runs automatically *before* a new user document is saved to the database.
UserSchema.pre('save', async function (next) {
  // We only want to hash the password if it's a new user or if the password is being changed.
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a 'salt' for hashing - a random string to make the hash unique
    const salt = await bcrypt.genSalt(10);
    // Hash the plain-text password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // Proceed to save the user document
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Instance Method ---
// This adds a custom method to every document created from this schema.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // Compares the provided password with the hashed password stored in the database.
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema and export it
const User = mongoose.model('User', UserSchema);

module.exports = User;
