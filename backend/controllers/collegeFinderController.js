const StudentProfile = require("../models/StudentProfile");
const colleges = require("../data/colleges");

// GET /api/college-finder
// Optional query params: collegeType, budget, location - each can
// override the student's saved preference for this one request, without
// changing what's stored in their profile. Omit a param to use their
// saved value.
const findColleges = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({ message: "Please complete onboarding first" });
    }

    // Query params win if present; otherwise fall back to the student's
    // saved onboarding preferences. This is what makes "pre-filled but
    // adjustable" filters possible on the frontend.
    const collegeType = req.query.collegeType || profile.preferences?.collegeType || "any";
    const budget = req.query.budget || profile.preferences?.budget || "any";
    const locationPref = req.query.location || profile.preferences?.location || "anywhere";

    let results = colleges;

    // Filter 1: college type (government/private/any)
    if (collegeType !== "any") {
      results = results.filter((c) =>
        c.type.toLowerCase().includes(collegeType.toLowerCase())
      );
    }

    // Filter 2: budget (low/moderate/any) - "moderate" maps to "medium"
    // in the data, since the dataset uses medium/low as its two tiers
    if (budget !== "any") {
      const budgetTier = budget === "moderate" ? "medium" : budget;
      results = results.filter((c) => c.budget === budgetTier);
    }

    // Filter 3: location - only meaningful for "district" (all colleges
    // in this dataset are already within J&K, so "state"/"anywhere"
    // wouldn't narrow anything further)
    let locationNote = null;
    if (locationPref === "district" && profile.district) {
      const districtMatches = results.filter(
        (c) => c.location.toLowerCase() === profile.district.toLowerCase()
      );
      if (districtMatches.length > 0) {
        results = districtMatches;
      } else {
        // Don't return an empty list just because their exact district
        // has no match - fall back to showing everything else that
        // matched, but tell the frontend why.
        locationNote = `No colleges found specifically in ${profile.district} matching your other filters - showing all Jammu & Kashmir options instead.`;
      }
    }

    res.status(200).json({
      colleges: results,
      appliedFilters: { collegeType, budget, location: locationPref },
      note: locationNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { findColleges };