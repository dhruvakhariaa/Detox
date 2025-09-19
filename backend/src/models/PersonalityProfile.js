const mongoose = require('mongoose');

const PersonalityProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Establishes a direct relationship to the User model
    required: true,
    unique: true, // Each user can only have one personality profile
  },
  
  // This section stores results from the initial 5-6 onboarding questions
  quickAnalysis: {
    summary: {
      type: String,
      trim: true,
    },
    traits: [String], // e.g., ['Introvert', 'Creative', 'Analytical']
    // Storing the exact questions and answers for future reference or reprocessing
    rawAnswers: {
        type: mongoose.Schema.Types.Mixed, 
    }
  },

  // This section stores results from the more detailed 25-30 question quiz
  deepAnalysis: {
    summary: {
        type: String,
        trim: true,
    },
    // Using a Map for a more structured key-value store of personality dimensions
    detailedTraits: {
      type: Map,
      of: Number, // e.g., { 'openness': 0.85, 'conscientiousness': 0.6 }
    },
    recommendations: [String], // AI-generated tips based on the profile
    rawAnswers: {
        type: mongoose.Schema.Types.Mixed,
    }
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// When a profile is updated, automatically update the 'lastUpdated' timestamp
PersonalityProfileSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

const PersonalityProfile = mongoose.model('PersonalityProfile', PersonalityProfileSchema);

module.exports = PersonalityProfile;
