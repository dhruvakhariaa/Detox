const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  mood: {
    type: String,
    required: [true, 'A mood must be selected'],
    // Using an enum restricts the possible values for the 'mood' field.
    // This enforces data consistency. You can expand this list as needed.
    enum: ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Neutral', 'Excited', 'Tired'],
  },
  notes: {
    type: String,
    trim: true, // Automatically removes whitespace from the start and end
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  // Sub-document to store the daily task associated with the mood
  dailyTask: {
    description: {
        type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- Compound Index for Uniqueness ---
// This is a powerful database-level rule. It ensures that the combination of
// a 'user' and a 'date' must be unique across all documents in the collection.
// This prevents a single user from creating multiple mood entries for the same day.
MoodEntrySchema.index({ user: 1, date: 1 }, { unique: true });

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

module.exports = MoodEntry;
