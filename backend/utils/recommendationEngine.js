// All dimensions that can appear in a "required" profile. A dimension not
// listed on a given pathway/career simply gets weight 0 - it never counts
// against the student.
const DIMENSIONS = [
  "academic", "logical", "numerical", "analytical", "problemSolving", "verbal", "spatial",
  "technology", "science", "business", "finance", "healthcare", "design", "teaching", "research",
];

// Human-readable labels, used when building the "why" explanation
const LABELS = {
  academic: "Academic performance",
  logical: "Logical reasoning",
  numerical: "Numerical ability",
  analytical: "Analytical thinking",
  problemSolving: "Problem solving",
  verbal: "Verbal ability",
  spatial: "Spatial reasoning",
  technology: "Technology interest",
  science: "Science interest",
  business: "Business interest",
  finance: "Finance interest",
  healthcare: "Healthcare interest",
  design: "Design interest",
  teaching: "Teaching interest",
  research: "Research interest",
};

// Builds the flat comparison vector the engine needs, from the pieces
// stored separately in StudentProfile (academicScores map, aptitudeScores,
// interests). This is the one place that "assembles" a student profile
// into the shape the scoring function expects.
function buildStudentVector(studentProfile) {
  const academicValues = studentProfile.academicScores
    ? Array.from(studentProfile.academicScores.values())
    : [];
  const academicAvg = academicValues.length
    ? Math.round(academicValues.reduce((a, b) => a + b, 0) / academicValues.length)
    : 0;

  return {
    academic: academicAvg,
    ...(studentProfile.aptitudeScores?.toObject?.() || studentProfile.aptitudeScores || {}),
    ...(studentProfile.interests?.toObject?.() || studentProfile.interests || {}),
  };
}

// For each dimension, penalize the ABSOLUTE gap between what's required
// and what the student has - whether the student falls short OR
// dramatically exceeds it. This matters for responsible recommendations:
// without it, a low-bar pathway (e.g. Vocational) would trivially score
// 100% for a strong student and unfairly outrank a harder pathway
// (e.g. Science-PCM) that actually makes better use of their ability.
function scoreOne(studentVec, requiredVec) {
  let totalPenalty = 0;
  let totalWeight = 0;

  for (const dim of DIMENSIONS) {
    const required = requiredVec[dim] || 0;
    const student = studentVec[dim] || 0;
    const gap = Math.abs(required - student);

    const weight = required;
    totalPenalty += gap * weight;
    totalWeight += 100 * weight;
  }

  if (totalWeight === 0) return 100;
  const score = 100 - (totalPenalty / totalWeight) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

// Returns the top N matches with match score, and the top 3 dimensions
// that contributed most positively (for the "why" explanation).
function computeMatches(studentVec, dataset, topN = 5) {
  const scored = dataset.map((item) => {
    const matchScore = scoreOne(studentVec, item.required);

    // "Why" reasons: dimensions the item cares about (required > 0) where
    // the student is close to (within 10 points of) what's needed, sorted
    // by how much the item weights that dimension.
    const reasons = DIMENSIONS
      .filter((dim) => item.required[dim] > 0 && Math.abs((studentVec[dim] || 0) - item.required[dim]) <= 10)
      .sort((a, b) => (item.required[b] || 0) - (item.required[a] || 0))
      .slice(0, 3)
      .map((dim) => LABELS[dim]);

    // Skill gaps: dimensions where the student falls notably short
    // (under-qualified only - exceeding isn't framed as a "gap")
    const gaps = DIMENSIONS
      .filter((dim) => item.required[dim] - (studentVec[dim] || 0) > 20)
      .map((dim) => LABELS[dim]);

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      matchScore,
      reasons,
      gaps,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, topN);
}

module.exports = { computeMatches, buildStudentVector, DIMENSIONS, LABELS };