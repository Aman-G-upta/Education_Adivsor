const mongoose = require("mongoose");

// Kept separate from your User model on purpose - User only handles
// login (name, email, password). This model holds everything about the
// student's education profile, linked back via userId.
const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Step 1: this single field decides which flow (Class 10 vs Class 12)
    // the rest of the app follows
    educationLevel: {
      type: String,
      enum: ["class10", "class12"],
    },
    stream: {
      type: String,
      enum: ["science", "commerce", "humanities", "other"],
    },

    // Step 2: basic profile
    fullName: String,
    age: Number,
    state: String,
    district: String,
    preferredLanguage: { type: String, default: "English" },

    // Step 3: academic scores - a flexible key-value map, NOT fixed
    // fields. This is what makes "add a custom subject" possible on the
    // frontend with zero backend changes - any subject name the student
    // types becomes a key in this map.
    academicScores: {
      type: Map,
      of: Number,
      default: {},
    },

    // Step 4: aptitude, 0-100 per dimension
    aptitudeScores: {
      logical: Number,
      numerical: Number,
      analytical: Number,
      problemSolving: Number,
      verbal: Number,
      spatial: Number,
    },

    // Step 5: interests, 0-100 per dimension
    interests: {
      technology: Number,
      science: Number,
      business: Number,
      finance: Number,
      healthcare: Number,
      design: Number,
      teaching: Number,
      research: Number,
    },

    // Step 6: preferences
    preferences: {
      collegeType: { type: String, enum: ["government", "private", "any"] },
      location: { type: String, enum: ["district", "state", "anywhere"] },
      budget: { type: String, enum: ["low", "moderate", "any"] },
      studyMode: { type: String, enum: ["degree", "diploma", "vocational", "not_sure"] },
    },

    // Which step the student last completed - 0 = not started, 6 = done.
    // The frontend calls GET /onboarding/me on load and uses this number
    // to decide whether to resume mid-flow or skip straight to results.
    onboardingStep: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);