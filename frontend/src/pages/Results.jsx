import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

export default function Results() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/recommendation/results")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load recommendations."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="onboarding-page">
        <p>Analyzing your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  const { educationLevel, matches } = data;
  const top = matches[0];
  const isClass10 = educationLevel === "class10";
  // Matches the URL param your backend route expects: /roadmap/pathway/:id or /roadmap/career/:id
  const roadmapType = isClass10 ? "pathway" : "career";

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <h2>Your Personalized Education Profile</h2>
        <p className="subtext">
          <Link to="/simulator" className="secondary-btn" style={{ display: "inline-block", marginBottom: 20 }}>
            Try the What-If Simulator &rarr;
          </Link>
          {isClass10
            ? "Based on your profile, here's the pathway that best keeps your future options open."
            : "Based on your profile, here are the careers that best fit you."}
        </p>

        <div className="result-top-card">
          <span className="result-badge">Best match</span>
          <Link to={`/roadmap/${roadmapType}/${top.id}`} className="result-name-link">
            <h3>{top.name}</h3>
          </Link>
          <div className="result-score">{top.matchScore}%</div>
          {top.reasons.length > 0 && (
            <div className="result-reasons">
              <strong>Why this fits you:</strong>
              <ul>
                {top.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {top.gaps.length > 0 && (
            <div className="result-gaps">
              <strong>Areas to strengthen:</strong> {top.gaps.join(", ")}
            </div>
          )}
          <Link to={`/roadmap/${roadmapType}/${top.id}`} className="primary-btn roadmap-cta">
            {isClass10 ? "See fields this opens up" : "See full roadmap"} &rarr;
          </Link>
        </div>

        <h3 className="alt-heading">Other options worth considering</h3>
        {matches.slice(1).map((m) => (
          <Link key={m.id} to={`/roadmap/${roadmapType}/${m.id}`} className="result-alt-card">
            <div>
              <strong>{m.name}</strong>
              <p className="alt-desc">{m.description}</p>
            </div>
            <div className="alt-score">{m.matchScore}%</div>
          </Link>
        ))}
      </div>
    </div>
  );
}