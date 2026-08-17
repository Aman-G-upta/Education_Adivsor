const careers = require("../data/careers");
const pathways = require("../data/pathways");
const courses = require("../data/courses");
const colleges = require("../data/colleges");
const exams = require("../data/exams");
const scholarships = require("../data/scholarships");

// GET /api/roadmap/career/:id
// The Class 12 version - full chain: career -> course -> colleges -> exams -> scholarships
const getCareerRoadmap = async (req, res) => {
  try {
    const career = careers.find((c) => c.id === req.params.id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    if (!career.linkedCourse) {
      // Honest response for careers we don't have verified J&K data for
      // (currently just UI/UX Designer) - rather than pretending.
      return res.status(200).json({
        career,
        course: null,
        colleges: [],
        exams: [],
        scholarships: [],
        note: "We don't yet have verified Jammu & Kashmir-specific institutions for this career. This section will be added once that data is confirmed from official sources.",
      });
    }

    const course = courses.find((c) => c.id === career.linkedCourse);
    const matchedColleges = colleges.filter((c) => c.courses.includes(career.linkedCourse));
    const examIds = [...new Set(matchedColleges.map((c) => c.entranceExam))];
    const matchedExams = exams.filter((e) => examIds.includes(e.id));
    const matchedScholarships = scholarships.filter((s) => s.appliesTo.includes(career.linkedCourse));

    res.status(200).json({
      career,
      course,
      colleges: matchedColleges,
      exams: matchedExams,
      scholarships: matchedScholarships,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/roadmap/pathway/:id
// The Class 10 version - lighter: pathway -> possible fields only, no
// colleges/exams yet, since choosing a stream comes before that.
const getPathwayRoadmap = async (req, res) => {
  try {
    const pathway = pathways.find((p) => p.id === req.params.id);
    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }

    res.status(200).json({ pathway });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getCareerRoadmap, getPathwayRoadmap };