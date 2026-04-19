const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getAllVolunteers } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/volunteers", authorizeRoles("admin"), getAllVolunteers);

module.exports = router;