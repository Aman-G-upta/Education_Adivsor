// Same required-skill profiles as before - only change is the added
// "linkedCourse" field, which connects each career to a real course id
// in courses.js, which in turn connects to real colleges/exams/scholarships.

const careers = [
  {
    id: "software_engineer",
    name: "Software Engineer",
    description: "Designs and builds software applications and systems.",
    required: { academic: 80, logical: 90, numerical: 75, problemSolving: 88, technology: 95 },
    linkedCourse: "btech-cse",
  },
  {
    id: "data_scientist",
    name: "Data Scientist",
    description: "Analyzes data to extract insights and build predictive models.",
    required: { academic: 88, numerical: 92, analytical: 90, logical: 85, technology: 85, research: 80 },
    linkedCourse: "btech-cse",
  },
  {
    id: "cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    description: "Protects systems and networks from digital attacks.",
    required: { academic: 75, logical: 88, analytical: 80, technology: 88, problemSolving: 80 },
    linkedCourse: "btech-cse",
  },
  {
    id: "civil_engineer",
    name: "Civil Engineer",
    description: "Designs and oversees construction of infrastructure projects.",
    required: { academic: 82, numerical: 85, spatial: 80, analytical: 75, technology: 55 },
    linkedCourse: "btech-civil",
  },
  {
    id: "doctor",
    name: "Doctor (MBBS)",
    description: "Diagnoses and treats patients in a clinical setting.",
    required: { academic: 90, analytical: 80, verbal: 75, healthcare: 90, science: 88 },
    linkedCourse: "mbbs",
  },
  {
    id: "pharmacist",
    name: "Pharmacist",
    description: "Prepares and dispenses medication, advises on drug safety.",
    required: { academic: 75, numerical: 65, analytical: 70, healthcare: 85, science: 75 },
    linkedCourse: "bpharm",
  },
  {
    id: "chartered_accountant",
    name: "Chartered Accountant",
    description: "Manages financial records, audits, and compliance.",
    required: { academic: 85, numerical: 90, analytical: 80, finance: 90, business: 70 },
    linkedCourse: "bcom",
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Educates and mentors students in an academic subject.",
    required: { academic: 65, verbal: 85, teaching: 90, analytical: 60 },
    linkedCourse: "babed",
  },
  {
    id: "ui_ux_designer",
    name: "UI/UX Designer",
    description: "Designs user interfaces and experiences for digital products.",
    required: { academic: 55, design: 92, verbal: 65, technology: 70, analytical: 55 },
    linkedCourse: null, // No verified J&K-specific design institute found - flagged, not invented
  },
  {
    id: "lawyer",
    name: "Law Professional",
    description: "Advises on legal matters and represents clients.",
    required: { academic: 78, verbal: 90, analytical: 80, research: 70 },
    linkedCourse: "ballb",
  },
];

module.exports = careers;