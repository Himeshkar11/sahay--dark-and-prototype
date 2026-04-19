const express = require("express");
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  matchAndAssign,
} = require("../controllers/issueController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// All issue routes require login
router.use(protect);

router.post("/", authorizeRoles("admin"), createIssue);
router.get("/", getIssues);                                         // all roles

// IMPORTANT: /:id/match must come BEFORE /:id so Express doesn't
// try to look up "match" as a MongoDB ObjectId.
router.post("/:id/match", authorizeRoles("admin"), matchAndAssign);

router.get("/:id", getIssueById);
router.patch("/:id", authorizeRoles("admin"), updateIssue);
router.delete("/:id", authorizeRoles("admin"), deleteIssue);

module.exports = router;