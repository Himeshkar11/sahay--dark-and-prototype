const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "volunteer", "donor"],
      default: "donor",
    },

    // Volunteer-specific fields
    skills: {
      type: [String],
      enum: ["food", "medical", "education"],
      default: [],
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    availability: {
      type: Boolean,
      default: false,
    },

    // Credits awarded after admin verifies completed assignments
    credits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);