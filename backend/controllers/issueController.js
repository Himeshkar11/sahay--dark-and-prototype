const Issue = require("../models/Issue");
const Assignment = require("../models/Assignment");
const { matchVolunteers } = require("../utils/matchEngine");

// @route  POST /api/issues
// @access Admin
exports.createIssue = async (req, res) => {
  try {
    const { title, description, type, urgency, location } = req.body;

    if (!title || !description || !type || !location?.lat || !location?.lng) {
      return res.status(400).json({ message: "title, description, type, location.lat, location.lng are required" });
    }

    const issue = await Issue.create({
      title,
      description,
      type,
      urgency,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/issues
// @access All logged-in users
exports.getIssues = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.urgency) filter.urgency = req.query.urgency;

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/issues/:id
// @access All logged-in users
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/issues/:id
// @access Admin
exports.updateIssue = async (req, res) => {
  try {
    // NOTE: use { new: true } in Mongoose (NOT returnDocument which is the MongoDB driver option)
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/issues/:id
// @access Admin
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/issues/:id/match
// @access Admin
// BUG FIX: was "match/:id" which conflicts with "/:id" in Express route matching.
// Now it's "/:id/match" so Express resolves /:id first with the actual ID,
// then checks the /match suffix — no ambiguity.
exports.matchAndAssign = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.status === "completed") {
      return res.status(400).json({ message: "Issue is already completed" });
    }

    const matches = await matchVolunteers(issue);

    if (!matches.length) {
      return res.status(404).json({ message: "No available volunteers match this issue" });
    }

    const assignments = [];

    for (const m of matches) {
      // Avoid duplicate assignments for the same volunteer+issue
      const existing = await Assignment.findOne({
        issueId: issue._id,
        volunteerId: m.volunteer._id,
      });

      if (!existing) {
        const assignment = await Assignment.create({
          issueId: issue._id,
          volunteerId: m.volunteer._id,
        });
        assignments.push(assignment);
      }
    }

    // Update issue status to assigned
    issue.status = "assigned";
    await issue.save();

    res.json({
      message: `${assignments.length} volunteer(s) assigned successfully`,
      matches: matches.map((m) => ({
        volunteer: {
          _id: m.volunteer._id,
          name: m.volunteer.name,
          email: m.volunteer.email,
          skills: m.volunteer.skills,
        },
        distanceKm: m.distanceKm,
        score: m.score,
      })),
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};