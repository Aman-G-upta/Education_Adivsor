import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

const STATUS_LABELS = {
  strong: "Strong",
  good: "Good",
  needs_work: "Needs work",
};

export default function SkillGap() {
  const { careerId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/skill-gap/${careerId}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load skill gap."))
      .finally(() => setLoading(false));
  }, [careerId]);

  if (loading) return <div className="onboarding-page"><p>Comparing your profile...</p></div>;

  if (error) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  const { career, breakdown, summary } = data;
  const needsWork = breakdown.filter((b) => b.status === "needs_work");

  return (
    <div className="onboarding-page">
      <div className="onboarding-card" style={{ maxWidth: 720 }}>
        <Link to={`/roadmap/career/${career.id}`} className="secondary-btn" style={{ display: "inline-block" }}>
          &larr; Back to {career.name} roadmap
        </Link>

        <h2 style={{ marginTop: 16 }}>Skill Gap: {career.name}</h2>
        <p className="subtext">{summary}</p>

        <h3>Full breakdown</h3>
        {breakdown.map((b) => (
          <div key={b.dimension} className="skill-row">
            <div className="skill-row-top">
              <span className="skill-label">{b.label}</span>
              <span className={`skill-badge skill-badge-${b.status}`}>{STATUS_LABELS[b.status]}</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-required" style={{ width: `${b.required}%` }} />
              <div
                className={`skill-bar-actual skill-bar-${b.status}`}
                style={{ width: `${b.actual}%` }}
              />
            </div>
            <div className="skill-bar-legend">
              <span>You: {b.actual}</span>
              <span>Needed: {b.required}</span>
            </div>
          </div>
        ))}

        {needsWork.length > 0 && (
          <>
            <h3 className="alt-heading" style={{ marginTop: 28 }}>What to work on, in priority order</h3>
            {needsWork.map((b, i) => (
              <div key={b.dimension} className="roadmap-block">
                <strong>{i + 1}. {b.label}</strong>
                <p className="roadmap-detail-line">{b.resource.tip}</p>
                <div className="resource-links">
                  {b.resource.resources.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      {r.name} &rarr;
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}