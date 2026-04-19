const User = require("../models/User");

// @route  GET /api/users/profile
// @access Protected
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/users/profile
// @access Protected (Volunteers updating their own profile)
exports.updateProfile = async (req, res) => {
  try {
    const { skills, location, availability, name } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (skills) updates.skills = skills;
    if (location) updates.location = location;
    if (availability !== undefined) updates.availability = availability;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/users/volunteers
// @access Admin
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("-password");
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};