// Maps each scoring dimension to a short improvement tip and 2-3 real
// learning resources. Kept to homepage/platform-level URLs on purpose -
// deep links to specific courses go stale fast, these platforms don't.

const skillResources = {
  academic: {
    tip: "Strengthen your core subject fundamentals with structured, free study material.",
    resources: [
      { name: "NCERT (official Indian textbooks, free)", url: "https://ncert.nic.in" },
      { name: "Khan Academy", url: "https://www.khanacademy.org" },
    ],
  },
  logical: {
    tip: "Practice logical reasoning and puzzle-solving regularly - it's a trainable skill.",
    resources: [
      { name: "GeeksforGeeks - Logical Reasoning", url: "https://www.geeksforgeeks.org" },
      { name: "Brilliant.org", url: "https://brilliant.org" },
    ],
  },
  numerical: {
    tip: "Build speed and confidence with numbers through consistent practice.",
    resources: [
      { name: "Khan Academy - Math", url: "https://www.khanacademy.org/math" },
      { name: "NCERT Mathematics", url: "https://ncert.nic.in" },
    ],
  },
  analytical: {
    tip: "Practice breaking problems into parts and comparing options systematically.",
    resources: [
      { name: "Brilliant.org", url: "https://brilliant.org" },
      { name: "Khan Academy", url: "https://www.khanacademy.org" },
    ],
  },
  problemSolving: {
    tip: "Solve structured problems regularly to build a repeatable problem-solving process.",
    resources: [
      { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org" },
      { name: "HackerRank", url: "https://www.hackerrank.com" },
    ],
  },
  verbal: {
    tip: "Read widely and practice explaining ideas clearly, in writing and out loud.",
    resources: [
      { name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish" },
      { name: "Khan Academy - Grammar", url: "https://www.khanacademy.org/humanities/grammar" },
    ],
  },
  spatial: {
    tip: "Practice visualizing shapes and spatial relationships with geometry tools.",
    resources: [
      { name: "GeoGebra", url: "https://www.geogebra.org" },
      { name: "Khan Academy - Geometry", url: "https://www.khanacademy.org/math/geometry" },
    ],
  },
  technology: {
    tip: "Get hands-on - build small projects rather than only reading theory.",
    resources: [
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { name: "NPTEL (free IIT/IISc courses)", url: "https://nptel.ac.in" },
    ],
  },
  science: {
    tip: "Revisit core science concepts with visual, example-driven explanations.",
    resources: [
      { name: "NCERT Science", url: "https://ncert.nic.in" },
      { name: "Khan Academy - Science", url: "https://www.khanacademy.org/science" },
    ],
  },
  business: {
    tip: "Learn business fundamentals through free structured courses.",
    resources: [
      { name: "NPTEL - Management", url: "https://nptel.ac.in" },
      { name: "Khan Academy - Economics & Finance", url: "https://www.khanacademy.org/economics-finance-domain" },
    ],
  },
  finance: {
    tip: "Build financial literacy with beginner-friendly, practical resources.",
    resources: [
      { name: "Khan Academy - Personal Finance", url: "https://www.khanacademy.org/college-careers-more/personal-finance" },
      { name: "NPTEL - Finance", url: "https://nptel.ac.in" },
    ],
  },
  healthcare: {
    tip: "Strengthen biology fundamentals - the foundation for any healthcare path.",
    resources: [
      { name: "NCERT Biology", url: "https://ncert.nic.in" },
      { name: "Khan Academy - Biology", url: "https://www.khanacademy.org/science/biology" },
    ],
  },
  design: {
    tip: "Practice by designing small real projects and studying interfaces you use daily.",
    resources: [
      { name: "Figma (free design tool + resources)", url: "https://www.figma.com/resources" },
      { name: "freeCodeCamp - Design", url: "https://www.freecodecamp.org" },
    ],
  },
  teaching: {
    tip: "Practice explaining concepts to others - it's the core teaching skill.",
    resources: [
      { name: "NIOS - Teacher Education Resources", url: "https://www.nios.ac.in" },
      { name: "Khan Academy (study how they explain concepts)", url: "https://www.khanacademy.org" },
    ],
  },
  research: {
    tip: "Practice reading a topic deeply and summarizing it in your own words.",
    resources: [
      { name: "NPTEL - Research Methodology", url: "https://nptel.ac.in" },
      { name: "Google Scholar", url: "https://scholar.google.com" },
    ],
  },
};

module.exports = skillResources;