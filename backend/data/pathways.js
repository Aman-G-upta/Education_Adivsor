// Same required-skill profiles as before - added "possibleFields", a
// simple list of fields this pathway keeps open. Deliberately NOT linked
// to specific colleges/exams - a Class 10 student shouldn't be shown
// college-level detail before they've even chosen a stream.

const pathways = [
  {
    id: "science_pcm",
    name: "Science - PCM (Physics, Chemistry, Maths)",
    description: "Keeps engineering, computing, architecture and physical sciences open.",
    required: { academic: 82, logical: 88, numerical: 90, analytical: 82, technology: 85, science: 75 },
    possibleFields: ["Engineering", "Computer Science", "Architecture", "Physical Sciences"],
  },
  {
    id: "science_pcb",
    name: "Science - PCB (Physics, Chemistry, Biology)",
    description: "Keeps medicine, pharmacy, biotechnology and life sciences open.",
    required: { academic: 80, logical: 78, numerical: 65, analytical: 80, healthcare: 85, science: 88 },
    possibleFields: ["Medicine", "Pharmacy", "Biotechnology", "Life Sciences"],
  },
  {
    id: "commerce",
    name: "Commerce",
    description: "Keeps finance, accounting, business and economics open.",
    required: { academic: 70, numerical: 75, analytical: 70, business: 85, finance: 80 },
    possibleFields: ["Finance", "Accounting (CA/CS)", "Business Management", "Economics"],
  },
  {
    id: "humanities",
    name: "Humanities / Arts",
    description: "Keeps teaching, law, psychology, civil services and design open.",
    required: { academic: 65, verbal: 85, analytical: 70, teaching: 70, research: 65, design: 40 },
    possibleFields: ["Teaching", "Law", "Psychology", "Civil Services", "Design"],
  },
  {
    id: "diploma",
    name: "Diploma (Engineering/Technical)",
    description: "A faster, hands-on route into technical fields without a full degree first.",
    required: { academic: 55, numerical: 60, technology: 70, problemSolving: 70 },
    possibleFields: ["Technical Trades", "Junior Engineering Roles", "Further Diploma-to-Degree Routes"],
  },
  {
    id: "vocational",
    name: "Vocational Education",
    description: "Skill-focused training leading directly to employment or further study.",
    required: { academic: 45, problemSolving: 65, technology: 55 },
    possibleFields: ["Skilled Trades", "Direct Employment", "Entrepreneurship"],
  },
];

module.exports = pathways;