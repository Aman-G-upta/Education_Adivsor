// appliesTo holds course ids from courses.js. PMSSS is the flagship
// scholarship for J&K/Ladakh students - verified against AICTE's own
// scheme description and multiple independent sources.

const scholarships = [
  {
    id: "pmsss",
    name: "Prime Minister's Special Scholarship Scheme (PMSSS)",
    provider: "AICTE, Ministry of Education, Government of India",
    eligibility:
      "Permanent resident of J&K or Ladakh; passed Class 12 from a JKBOSE or CBSE-affiliated school in J&K/Ladakh; family income up to ₹8,00,000/year",
    benefit:
      "Academic fee coverage (₹30,000 - ₹3,00,000 depending on course) plus ₹1,00,000/year maintenance allowance, for study OUTSIDE J&K/Ladakh",
    appliesTo: ["btech-cse", "btech-civil", "mbbs", "bpharm", "bcom"],
    source: "aicte-jk-scholarship-gov.in",
  },
];

module.exports = scholarships;