const express = require("express");
const router = express.Router();
const {
  getMyAssignments,
  getAllAssignments,
  getAssignmentsForIssue,
  markComplete,
  verifyAndAwardCredits,
} = require("../controllers/assignmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

// Volunteer routes
router.get("/my", authorizeRoles("volunteer"), getMyAssignments);
router.patch("/:id/complete", authorizeRoles("volunteer"), markComplete);

// Admin routes
router.get("/", authorizeRoles("admin"), getAllAssignments);
router.get("/issue/:issueId", authorizeRoles("admin"), getAssignmentsForIssue);
router.patch("/:id/verify", authorizeRoles("admin"), verifyAndAwardCredits);

module.exports = router;