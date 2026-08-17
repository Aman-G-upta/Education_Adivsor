const StudentProfile = require("../models/StudentProfile");
const careers = require("../data/careers");
const skillResources = require("../data/skillResources");
const { buildStudentVector, DIMENSIONS, LABELS } = require("../utils/recommendationEngine");

// GET /api/skill-gap/:careerId
const getSkillGap = async (req, res) => {
  try {
    const career = careers.find((c) => c.id === req.params.careerId);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    const profile = await StudentProfile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: "Please complete onboarding first" });
    }

    const studentVec = buildStudentVector(profile);

    // Only look at dimensions this career actually cares about
    // (required > 0) - no point showing "Finance interest" for a
    // Software Engineer breakdown.
    const relevantDims = DIMENSIONS.filter((dim) => career.required[dim] > 0);

    const breakdown = relevantDims
      .map((dim) => {
        const required = career.required[dim];
        const actual = studentVec[dim] || 0;
        const gap = required - actual; // positive = student falls short

        let status;
        if (gap <= 5) status = "strong";
        else if (gap <= 15) status = "good";
        else status = "needs_work";

        return {
          dimension: dim,
          label: LABELS[dim],
          required,
          actual,
          gap,
          status,
          // Only attach learning resources where they're actually needed
          resource: status === "needs_work" ? skillResources[dim] : null,
        };
      })
      // Biggest gaps first - this IS the "what to work on" priority order
      .sort((a, b) => b.gap - a.gap);

    const needsWorkCount = breakdown.filter((b) => b.status === "needs_work").length;

    res.status(200).json({
      career: { id: career.id, name: career.name },
      breakdown,
      summary:
        needsWorkCount === 0
          ? "You're already well-matched across every area this career needs."
          : `Focus on ${needsWorkCount} area${needsWorkCount > 1 ? "s" : ""} to strengthen your fit for this career.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSkillGap };