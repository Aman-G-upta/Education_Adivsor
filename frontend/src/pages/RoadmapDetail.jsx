import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

export default function RoadmapDetail() {
  const { type, id } = useParams(); // type = "career" or "pathway"
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/roadmap/${type}/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load this roadmap."))
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading) {
    return (
      <div className="onboarding-page">
        <p>Loading roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <p className="error-text">{error}</p>
          <button className="secondary-btn" onClick={() => navigate("/results")}>Back to results</button>
        </div>
      </div>
    );
  }

  // ===== Class 10 pathway view - fields only, no colleges yet =====
  if (type === "pathway") {
    const { pathway } = data;
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <button className="secondary-btn" onClick={() => navigate("/results")}>&larr; Back to results</button>
          <h2 style={{ marginTop: 16 }}>{pathway.name}</h2>
          <p className="subtext">{pathway.description}</p>

          <h3>Fields this pathway keeps open</h3>
          <div className="field-chip-row">
            {pathway.possibleFields.map((f) => (
              <span key={f} className="field-chip">{f}</span>
            ))}
          </div>

          <p className="roadmap-note">
            Specific colleges and entrance exams become relevant once you reach Class 12 and
            choose a course within one of these fields - we'll show that level of detail then.
          </p>
        </div>
      </div>
    );
  }

  // ===== Class 12 career view - full course/college/exam/scholarship chain =====
  const { career, course, colleges, exams, scholarships, note } = data;

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <button className="secondary-btn" onClick={() => navigate("/results")}>&larr; Back to results</button>
        <h2 style={{ marginTop: 16 }}>{career.name}</h2>
        <p className="subtext">{career.description}</p>

        {note && <p className="roadmap-note">{note}</p>}

        {career.linkedCourse && (
          <Link to={`/skill-gap/${career.id}`} className="primary-btn" style={{ marginBottom: 20 }}>
            See my skill gap for this career &rarr;
          </Link>
        )}
        {course && (
          <>
            <h3>Course to pursue</h3>
            <div className="roadmap-block">
              <strong>{course.name}</strong>
              <p className="roadmap-detail-line">{course.duration} &middot; Eligibility: {course.eligibility}</p>
            </div>

            <h3>Colleges in Jammu &amp; Kashmir</h3>
            {colleges.map((c) => (
              <div key={c.id} className="roadmap-block">
                <strong>{c.name}</strong>
                <p className="roadmap-detail-line">{c.location} &middot; {c.type}</p>
              </div>
            ))}

            <h3>Entrance exams</h3>
            {exams.map((e) => (
              <div key={e.id} className="roadmap-block">
                <strong>{e.name}</strong>
                <p className="roadmap-detail-line">{e.conductedBy}</p>
                <p className="roadmap-detail-line">{e.description}</p>
              </div>
            ))}

            <h3>Scholarships you may be eligible for</h3>
            {scholarships.length > 0 ? (
              scholarships.map((s) => (
                <div key={s.id} className="roadmap-block scholarship-block">
                  <strong>{s.name}</strong>
                  <p className="roadmap-detail-line">{s.provider}</p>
                  <p className="roadmap-detail-line"><strong>Eligibility:</strong> {s.eligibility}</p>
                  <p className="roadmap-detail-line"><strong>Benefit:</strong> {s.benefit}</p>
                </div>
              ))
            ) : (
              <p className="subtext">No specific scholarship matched yet - check the National Scholarship Portal (scholarships.gov.in) for general options.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}