const User = require("../models/User");

// Haversine distance in km between two lat/lng points
const calculateDistance = (loc1, loc2) => {
  if (!loc1 || !loc2 || loc1.lat == null || loc2.lat == null) return Infinity;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Higher urgency = bigger bonus (lowers the score, prioritising urgent issues)
const URGENCY_BONUS = {
  high: 50,
  medium: 20,
  low: 0,
};

/**
 * Finds the best matching volunteers for a given issue.
 * Score = distance_km - urgency_bonus  (lower is better)
 * Returns top 3 matches with volunteer data and score.
 */
const matchVolunteers = async (issue) => {
  try {
    const volunteers = await User.find({
      role: "volunteer",
      availability: true,
      skills: issue.type, // volunteer must have the right skill
    }).select("-password");

    if (!volunteers.length) return [];

    const scored = volunteers
      .map((v) => {
        const distance = calculateDistance(issue.location, v.location);
        const score = distance - (URGENCY_BONUS[issue.urgency] || 0);
        return { volunteer: v, score, distanceKm: parseFloat(distance.toFixed(2)) };
      })
      .sort((a, b) => a.score - b.score);

    return scored.slice(0, 3);
  } catch (error) {
    console.error("Matching engine error:", error.message);
    return [];
  }
};

module.exports = { matchVolunteers };