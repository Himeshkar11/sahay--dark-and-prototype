const Assignment = require("../models/Assignment");
const Issue = require("../models/Issue");
const User = require("../models/User");

// @route  GET /api/assignments/my
// @access Volunteer
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ volunteerId: req.user._id })
      .populate("issueId", "title description type urgency status location")
      .sort({ assignedAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/assignments
// @access Admin
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("issueId", "title type urgency status")
      .populate("volunteerId", "name email skills")
      .sort({ assignedAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/assignments/issue/:issueId
// @access Admin — see who picked up a specific issue
exports.getAssignmentsForIssue = async (req, res) => {
  try {
    const assignments = await Assignment.find({ issueId: req.params.issueId })
      .populate("volunteerId", "name email skills availability credits");

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/assignments/:id/complete
// @access Volunteer — marks their assignment as done (pending admin verification)
exports.markComplete = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Only the assigned volunteer can mark it complete
    if (assignment.volunteerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    if (assignment.markedCompleteByVolunteer) {
      return res.status(400).json({ message: "Already marked as complete" });
    }

    assignment.markedCompleteByVolunteer = true;
    assignment.status = "completed";
    assignment.completedAt = new Date();
    await assignment.save();

    res.json({ message: "Marked as complete. Awaiting admin verification.", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/assignments/:id/verify
// @access Admin — verifies completion and awards credits to volunteer
exports.verifyAndAwardCredits = async (req, res) => {
  try {
    const { creditsToAward = 10 } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (!assignment.markedCompleteByVolunteer) {
      return res.status(400).json({ message: "Volunteer has not marked this as complete yet" });
    }

    if (assignment.verifiedByAdmin) {
      return res.status(400).json({ message: "Already verified" });
    }

    // Verify and award credits
    assignment.verifiedByAdmin = true;
    assignment.status = "verified";
    assignment.creditsAwarded = creditsToAward;
    await assignment.save();

    // Add credits to volunteer's account
    await User.findByIdAndUpdate(assignment.volunteerId, {
      $inc: { credits: creditsToAward },
    });

    // Check if all assignments for this issue are verified → mark issue completed
    const pendingAssignments = await Assignment.find({
      issueId: assignment.issueId,
      verifiedByAdmin: false,
    });

    if (!pendingAssignments.length) {
      await Issue.findByIdAndUpdate(assignment.issueId, { status: "completed" });
    }

    res.json({
      message: `Verified! ${creditsToAward} credits awarded to volunteer.`,
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};