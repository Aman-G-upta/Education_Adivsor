// Same colleges as before - added "budget" (low/medium) as an
// approximate fee tier for filtering. These are illustrative, not exact
// verified fee figures - flag this to your team before presenting as fact.

const colleges = [
  {
    id: "nit-srinagar",
    name: "National Institute of Technology (NIT) Srinagar",
    location: "Srinagar",
    type: "Government - Institute of National Importance",
    budget: "medium", // centrally-funded institute, higher than state college fees
    courses: ["btech-cse", "btech-civil"],
    entranceExam: "jee-main",
  },
  {
    id: "iit-jammu",
    name: "Indian Institute of Technology (IIT) Jammu",
    location: "Jammu",
    type: "Government - Institute of National Importance",
    budget: "medium",
    courses: ["btech-cse", "btech-civil"],
    entranceExam: "jee-advanced",
  },
  {
    id: "gcet-jammu",
    name: "Government College of Engineering & Technology (GCET), Jammu",
    location: "Jammu",
    type: "Government (State)",
    budget: "low",
    courses: ["btech-cse", "btech-civil"],
    entranceExam: "jkcet",
  },
  {
    id: "gmc-srinagar",
    name: "Government Medical College (GMC) Srinagar",
    location: "Srinagar",
    type: "Government",
    budget: "low",
    courses: ["mbbs"],
    entranceExam: "neet-ug",
  },
  {
    id: "gmc-jammu",
    name: "Government Medical College (GMC) Jammu",
    location: "Jammu",
    type: "Government",
    budget: "low",
    courses: ["mbbs"],
    entranceExam: "neet-ug",
  },
  {
    id: "skims-srinagar",
    name: "Sher-i-Kashmir Institute of Medical Sciences (SKIMS)",
    location: "Srinagar",
    type: "Government (Autonomous)",
    budget: "low",
    courses: ["mbbs"],
    entranceExam: "neet-ug",
  },
  {
    id: "aiims-vijaypur",
    name: "AIIMS Vijaypur, Jammu",
    location: "Jammu",
    type: "Government - Institute of National Importance",
    budget: "low", // AIIMS institutes are famously low-fee despite being premier institutes
    courses: ["mbbs"],
    entranceExam: "neet-ug",
  },
  {
    id: "ku-srinagar",
    name: "University of Kashmir",
    location: "Srinagar",
    type: "Government (State University)",
    budget: "low",
    courses: ["bpharm", "ballb", "bcom"],
    entranceExam: "cuet-ug",
  },
  {
    id: "ju-jammu",
    name: "University of Jammu",
    location: "Jammu",
    type: "Government (State University)",
    budget: "low",
    courses: ["ballb", "babed", "bcom"],
    entranceExam: "cuet-ug",
  },
];

module.exports = colleges;