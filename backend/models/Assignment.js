const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in-progress", "completed", "verified"],
      default: "assigned",
    },

    // Volunteer marks this true when job is done
    markedCompleteByVolunteer: {
      type: Boolean,
      default: false,
    },

    // Admin verifies the completion and awards credits
    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },

    // Credits awarded upon admin verification
    creditsAwarded: {
      type: Number,
      default: 0,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);