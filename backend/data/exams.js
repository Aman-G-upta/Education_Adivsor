const exams = [
  {
    id: "jee-main",
    name: "JEE Main",
    conductedBy: "National Testing Agency (NTA)",
    description: "Required for NIT admissions; also a qualifier for JEE Advanced.",
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    conductedBy: "IITs (rotating zonal coordinating institute)",
    description: "Required for IIT admissions, including IIT Jammu.",
  },
  {
    id: "jkcet",
    name: "JKCET (J&K Common Entrance Test)",
    conductedBy: "JKBOPEE (J&K Board of Professional Entrance Examinations)",
    description: "State-level entrance test for engineering admission to J&K government colleges like GCET Jammu.",
  },
  {
    id: "neet-ug",
    name: "NEET-UG",
    conductedBy: "National Testing Agency (NTA)",
    description: "Mandatory for all MBBS/BDS admissions in India, including all J&K medical colleges.",
  },
  {
    id: "cuet-ug",
    name: "CUET UG (Common University Entrance Test)",
    conductedBy: "National Testing Agency (NTA)",
    description: "Required for undergraduate admission to central/state universities like University of Jammu and University of Kashmir.",
  },
];

module.exports = exams;