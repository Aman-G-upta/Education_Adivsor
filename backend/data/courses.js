// Every course here is a real degree program. linkedCareers matches the
// career "id" values in careers.js - this is what connects a career
// recommendation to an actual course to pursue.

const courses = [
  {
    id: "btech-cse",
    name: "B.Tech Computer Science & Engineering",
    duration: "4 years",
    eligibility: "12th with Physics, Chemistry, Mathematics (PCM)",
    linkedCareers: ["software_engineer", "data_scientist", "cybersecurity_analyst"],
  },
  {
    id: "btech-civil",
    name: "B.Tech Civil Engineering",
    duration: "4 years",
    eligibility: "12th with Physics, Chemistry, Mathematics (PCM)",
    linkedCareers: ["civil_engineer"],
  },
  {
    id: "mbbs",
    name: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    duration: "5.5 years (incl. internship)",
    eligibility: "12th with Physics, Chemistry, Biology (PCB)",
    linkedCareers: ["doctor"],
  },
  {
    id: "bpharm",
    name: "B.Pharm",
    duration: "4 years",
    eligibility: "12th with PCB or PCM",
    linkedCareers: ["pharmacist"],
  },
  {
    id: "ballb",
    name: "BA LLB (5 Year Integrated)",
    duration: "5 years",
    eligibility: "12th, any stream, min 45% (40% for SC/ST)",
    linkedCareers: ["lawyer"],
  },
  {
    id: "babed",
    name: "B.A-B.Ed (ITEP - Integrated Teacher Education Programme)",
    duration: "4 years",
    eligibility: "12th, any stream",
    linkedCareers: ["teacher"],
  },
  {
    id: "bcom",
    name: "B.Com",
    duration: "3 years",
    eligibility: "12th, any stream",
    linkedCareers: ["chartered_accountant"],
  },
];

module.exports = courses;