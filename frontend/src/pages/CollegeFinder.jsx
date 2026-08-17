import { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/auth.css";

export default function CollegeFinder() {
  const [colleges, setColleges] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // These start empty and get filled in from the student's SAVED
  // preferences once the first fetch responds - that's what makes the
  // filters arrive "pre-filled" instead of the student having to set
  // them from scratch every time.
  const [collegeType, setCollegeType] = useState(null);
  const [budget, setBudget] = useState(null);
  const [location, setLocation] = useState(null);

  // Runs on page load with no query params - backend falls back to
  // saved preferences automatically.
  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchColleges(overrides = {}) {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (overrides.collegeType || collegeType) params.set("collegeType", overrides.collegeType || collegeType);
    if (overrides.budget || budget) params.set("budget", overrides.budget || budget);
    if (overrides.location || location) params.set("location", overrides.location || location);

    API.get(`/college-finder?${params.toString()}`)
      .then((res) => {
        setColleges(res.data.colleges);
        setAppliedFilters(res.data.appliedFilters);
        setNote(res.data.note);
        // Sync the filter buttons to whatever the backend actually applied
        // (relevant on first load, when the frontend hasn't set these yet)
        setCollegeType(res.data.appliedFilters.collegeType);
        setBudget(res.data.appliedFilters.budget);
        setLocation(res.data.appliedFilters.location);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load colleges."))
      .finally(() => setLoading(false));
  }

  // Each filter button click re-fetches immediately with the new value -
  // no separate "Apply" button needed, feels more responsive.
  function updateFilter(key, value) {
    if (key === "collegeType") setCollegeType(value);
    if (key === "budget") setBudget(value);
    if (key === "location") setLocation(value);
    fetchColleges({ [key]: value });
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card" style={{ maxWidth: 720 }}>
        <h2>College Finder</h2>
        <p className="subtext">
          Pre-filled using the preferences you set during onboarding - adjust any filter below to browse differently.
        </p>

        <div className="finder-filters">
          <div className="filter-group">
            <label>College type</label>
            <div className="choice-row">
              {["government", "private", "any"].map((v) => (
                <button
                  key={v}
                  className={`choice-card small ${collegeType === v ? "selected" : ""}`}
                  onClick={() => updateFilter("collegeType", v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Budget</label>
            <div className="choice-row">
              {["low", "moderate", "any"].map((v) => (
                <button
                  key={v}
                  className={`choice-card small ${budget === v ? "selected" : ""}`}
                  onClick={() => updateFilter("budget", v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <div className="choice-row">
              {["district", "state", "anywhere"].map((v) => (
                <button
                  key={v}
                  className={`choice-card small ${location === v ? "selected" : ""}`}
                  onClick={() => updateFilter("location", v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {note && <p className="roadmap-note">{note}</p>}
        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="subtext">Loading colleges...</p>
        ) : colleges.length === 0 ? (
          <p className="subtext">No colleges match these filters. Try loosening one of them.</p>
        ) : (
          <>
            <p className="alt-heading">{colleges.length} college{colleges.length !== 1 ? "s" : ""} found</p>
            {colleges.map((c) => (
              <div key={c.id} className="roadmap-block">
                <strong>{c.name}</strong>
                <p className="roadmap-detail-line">{c.location} &middot; {c.type}</p>
                <p className="roadmap-detail-line">Budget tier: {c.budget}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}