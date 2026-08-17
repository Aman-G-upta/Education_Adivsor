import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { computeMatches, DIMENSIONS, LABELS } from "../utils/scoringEngine";
import "../styles/auth.css";

// Grouped for a cleaner UI - not every dimension applies to every
// student, but showing all of them lets a student explore "what if I'd
// been more interested in X" too, not just academics.
const GROUPS = [
  { title: "Academic", dims: ["academic"] },
  { title: "Aptitude", dims: ["logical", "numerical", "analytical", "problemSolving", "verbal", "spatial"] },
  { title: "Interests", dims: ["technology", "science", "business", "finance", "healthcare", "design", "teaching", "research"] },
];

export default function WhatIfSimulator() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [educationLevel, setEducationLevel] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [originalVector, setOriginalVector] = useState(null);
  const [vector, setVector] = useState(null);

  // Load both the student's actual profile AND the reference dataset
  // once, on page load. Everything after this is pure client-side math.
  useEffect(() => {
    Promise.all([API.get("/onboarding/me"), API.get("/recommendation/dataset")])
      .then(([profileRes, datasetRes]) => {
        const profile = profileRes.data;
        const academicValues = profile.academicScores
          ? Object.values(profile.academicScores)
          : [];
        const academicAvg = academicValues.length
          ? Math.round(academicValues.reduce((a, b) => a + b, 0) / academicValues.length)
          : 0;

        const builtVector = {
          academic: academicAvg,
          ...profile.aptitudeScores,
          ...profile.interests,
        };

        setOriginalVector(builtVector);
        setVector(builtVector);
        setEducationLevel(datasetRes.data.educationLevel);
        setDataset(datasetRes.data.dataset);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  function updateDimension(dim, value) {
    // No API call here at all - this is the whole point. Updating state
    // triggers a re-render, and computeMatches() below runs fresh on
    // every render with whatever the slider values currently are.
    setVector((prev) => ({ ...prev, [dim]: Number(value) }));
  }

  function resetToActual() {
    setVector(originalVector);
  }

  if (loading) {
    return <div className="onboarding-page"><p>Loading simulator...</p></div>;
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

  // Recalculated on every render - this IS the live recalculation.
  const matches = computeMatches(vector, dataset, 5);
  const originalMatches = computeMatches(originalVector, dataset, 5);
  const top = matches[0];
  const originalTop = originalMatches[0];
  const scoreDelta = top.matchScore - (matches.find((m) => m.id === originalTop.id)?.matchScore ?? 0);

  return (
    <div className="onboarding-page">
      <div className="onboarding-card" style={{ maxWidth: 780 }}>
        <h2>What-If Simulator</h2>
        <p className="subtext">
          Drag any slider to see how your {educationLevel === "class10" ? "pathway" : "career"} matches would
          change - nothing here is saved, it's just for exploring.
        </p>

        <div className="simulator-layout">
          <div className="simulator-sliders">
            {GROUPS.map((group) => (
              <div key={group.title} className="slider-group">
                <h3>{group.title}</h3>
                {group.dims.map((dim) => (
                  <div key={dim} className="slider-row">
                    <div className="slider-row-label">
                      <span>{LABELS[dim]}</span>
                      <span className="slider-value">{vector[dim] ?? 0}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vector[dim] ?? 0}
                      onChange={(e) => updateDimension(dim, e.target.value)}
                      className="slider-input"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button className="secondary-btn" onClick={resetToActual}>Reset to my actual profile</button>
          </div>

          <div className="simulator-results">
            <div className="result-top-card">
              <span className="result-badge">Live top match</span>
              <h3>{top.name}</h3>
              <div className="result-score">
                {top.matchScore}%
                {scoreDelta !== 0 && (
                  <span className={`score-delta ${scoreDelta > 0 ? "positive" : "negative"}`}>
                    {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                  </span>
                )}
              </div>
              {top.reasons.length > 0 && (
                <div className="result-reasons">
                  <strong>Why:</strong>
                  <ul>
                    {top.reasons.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <h3 className="alt-heading">Full ranking with these settings</h3>
            {matches.map((m, i) => (
              <div key={m.id} className="result-alt-card" style={{ cursor: "default" }}>
                <div>
                  <strong>{i + 1}. {m.name}</strong>
                </div>
                <div className="alt-score">{m.matchScore}%</div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/results" className="secondary-btn" style={{ display: "inline-block", marginTop: 20 }}>
          &larr; Back to my actual results
        </Link>
      </div>
    </div>
  );
}