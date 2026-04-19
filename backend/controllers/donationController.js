const Donation = require("../models/Donation");

// @route  POST /api/donations
// @access Public (anyone can donate)
exports.createDonation = async (req, res) => {
  try {
    const { amount, donorName, message } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Amount must be at least ₹1" });
    }

    // Mock payment: generate a fake payment ID
    const paymentId = "mock_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

    const donation = await Donation.create({
      donorId: req.user?._id || null,
      donorName: donorName || req.user?.name || "Anonymous",
      amount,
      paymentId,
      paymentMethod: "mock",
      status: "success",
      message: message || "",
    });

    res.status(201).json({
      message: "Donation successful! Thank you 🙏",
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/donations
// @access Admin
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    const total = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({ total, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/donations/my
// @access Protected
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};