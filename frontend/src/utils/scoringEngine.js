// This MUST stay in sync with backend/utils/recommendationEngine.js -
// same formula, same dimensions, same labels. It's duplicated here
// specifically so the What-If Simulator can recalculate instantly on
// every slider move without a network round-trip.

export const DIMENSIONS = [
  "academic", "logical", "numerical", "analytical", "problemSolving", "verbal", "spatial",
  "technology", "science", "business", "finance", "healthcare", "design", "teaching", "research",
];

export const LABELS = {
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

// Identical formula to the backend: penalize the ABSOLUTE gap between
// required and actual, weighted by how much the item cares about that
// dimension. See recommendationEngine.js on the backend for the full
// reasoning (the "why not just penalize shortfall" explanation).
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

export function computeMatches(studentVec, dataset, topN = 5) {
  const scored = dataset.map((item) => {
    const matchScore = scoreOne(studentVec, item.required);

    const reasons = DIMENSIONS
      .filter((dim) => item.required[dim] > 0 && Math.abs((studentVec[dim] || 0) - item.required[dim]) <= 10)
      .sort((a, b) => (item.required[b] || 0) - (item.required[a] || 0))
      .slice(0, 3)
      .map((dim) => LABELS[dim]);

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