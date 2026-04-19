const express = require("express");
const router = express.Router();
const { createDonation, getAllDonations, getMyDonations } = require("../controllers/donationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Anyone can donate (no auth required for POST)
router.post("/", createDonation);

// Auth required below
router.use(protect);

router.get("/my", getMyDonations);
router.get("/", authorizeRoles("admin"), getAllDonations);

module.exports = router;