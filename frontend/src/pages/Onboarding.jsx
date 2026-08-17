import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

// Default subjects shown depend on class + stream. The student can still
// add MORE subjects beyond this list (see "Add another subject" below).
const SUBJECTS_BY_LEVEL = {
  class10: ["Mathematics", "Science", "English", "Social Science"],
  science: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
  commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
  humanities: ["History", "Political Science", "Geography", "Economics", "English"],
  other: ["English"],
};

const APTITUDE_QUESTIONS = [
  { id: "ap1", text: "I can quickly work out logical puzzles.", dim: "logical" },
  { id: "ap2", text: "I break problems into clear, ordered steps.", dim: "logical" },
  { id: "ap3", text: "I'm comfortable working with numbers and calculations.", dim: "numerical" },
  { id: "ap4", text: "I can estimate answers quickly without a calculator.", dim: "numerical" },
  { id: "ap5", text: "I notice patterns and connections others miss.", dim: "analytical" },
  { id: "ap6", text: "I enjoy comparing options before deciding.", dim: "analytical" },
  { id: "ap7", text: "I stay calm and methodical when stuck on a problem.", dim: "problemSolving" },
  { id: "ap8", text: "I try multiple approaches before giving up.", dim: "problemSolving" },
  { id: "ap9", text: "I can explain my ideas clearly in words.", dim: "verbal" },
  { id: "ap10", text: "I enjoy reading and understanding new material.", dim: "verbal" },
  { id: "ap11", text: "I can visualize how shapes fit together.", dim: "spatial" },
  { id: "ap12", text: "I'm good at reading maps or diagrams.", dim: "spatial" },
];

const INTEREST_QUESTIONS = [
  { id: "in1", text: "Building or coding a small software project.", dim: "technology" },
  { id: "in2", text: "Running experiments or exploring how things work.", dim: "science" },
  { id: "in3", text: "Managing a business idea or a small team.", dim: "business" },
  { id: "in4", text: "Working with numbers, budgets, or investments.", dim: "finance" },
  { id: "in5", text: "Helping people with health or wellbeing.", dim: "healthcare" },
  { id: "in6", text: "Designing something visual - posters, apps, spaces.", dim: "design" },
  { id: "in7", text: "Explaining or teaching an idea to someone else.", dim: "teaching" },
  { id: "in8", text: "Digging deep into a topic to understand it fully.", dim: "research" },
];

function ScaleQuestion({ question, value, onChange }) {
  return (
    <div className="scale-question">
      <p>{question.text}</p>
      <div className="scale-buttons">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`scale-btn ${value === n ? "selected" : ""}`}
            onClick={() => onChange(question.id, n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [educationLevel, setEducationLevel] = useState("");
  const [stream, setStream] = useState("");
  const [basicInfo, setBasicInfo] = useState({ fullName: "", age: "", state: "", district: "", preferredLanguage: "English" });

  // academicScores holds BOTH the default subjects and any custom ones -
  // they all live in the same object, keyed by subject name.
  const [academicScores, setAcademicScores] = useState({});
  // customSubjects tracks just the extra subject names the student typed
  // in, so we know which input rows to render beyond the fixed list.
  const [customSubjects, setCustomSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");

  const [aptitudeAnswers, setAptitudeAnswers] = useState({});
  const [interestAnswers, setInterestAnswers] = useState({});
  const [preferences, setPreferences] = useState({ collegeType: "", location: "", budget: "", studyMode: "" });

  const subjectKey = educationLevel === "class10" ? "class10" : stream;
  const defaultSubjects = SUBJECTS_BY_LEVEL[subjectKey] || [];
  const allSubjects = [...defaultSubjects, ...customSubjects];

  // Resume progress on load
  useEffect(() => {
    API.get("/onboarding/me")
      .then((res) => {
        const profile = res.data;
        if (profile.onboardingStep >= 6) {
          navigate("/results");
        } else if (profile.onboardingStep > 0) {
          setStep(profile.onboardingStep);
          if (profile.educationLevel) setEducationLevel(profile.educationLevel);
          if (profile.stream) setStream(profile.stream);
        }
      })
      .catch(() => {
        // No profile yet - brand new student, just start at step 0
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scoreByDimension(questions, answers) {
    const totals = {}, counts = {};
    for (const q of questions) {
      const val = answers[q.id];
      if (val == null) continue;
      totals[q.dim] = (totals[q.dim] || 0) + val * 20;
      counts[q.dim] = (counts[q.dim] || 0) + 1;
    }
    const result = {};
    for (const dim in totals) result[dim] = Math.round(totals[dim] / counts[dim]);
    return result;
  }

  // Adds a new empty row for a custom subject - the student then types
  // its name directly into that row (see the input rendering below).
  function addCustomSubject() {
    const name = newSubjectName.trim();
    if (!name) return;
    if (allSubjects.includes(name)) {
      setError("That subject is already added.");
      return;
    }
    setCustomSubjects([...customSubjects, name]);
    setNewSubjectName("");
    setError("");
  }

  function removeCustomSubject(name) {
    setCustomSubjects(customSubjects.filter((s) => s !== name));
    const updated = { ...academicScores };
    delete updated[name];
    setAcademicScores(updated);
  }

  async function handleStep0Next() {
    if (!educationLevel) return setError("Please select your education level.");
    if (educationLevel === "class12" && !stream) return setError("Please select your stream.");
    setError("");
    setLoading(true);
    try {
      await API.post("/onboarding/education-level", { educationLevel, stream: stream || undefined });
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep1Next() {
    if (!basicInfo.fullName || !basicInfo.age || !basicInfo.state) {
      return setError("Name, age, and state are required.");
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/onboarding/basic-profile", basicInfo);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2Next() {
    const missing = allSubjects.some((s) => !academicScores[s] && academicScores[s] !== 0);
    if (missing) return setError("Please fill in every subject score, or remove unused ones.");
    setError("");
    setLoading(true);
    try {
      await API.post("/onboarding/academic", { scores: academicScores });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep3Next() {
    if (APTITUDE_QUESTIONS.some((q) => aptitudeAnswers[q.id] == null)) {
      return setError("Please answer every question.");
    }
    setError("");
    setLoading(true);
    try {
      const scored = scoreByDimension(APTITUDE_QUESTIONS, aptitudeAnswers);
      await API.post("/onboarding/aptitude", scored);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep4Next() {
    if (INTEREST_QUESTIONS.some((q) => interestAnswers[q.id] == null)) {
      return setError("Please answer every question.");
    }
    setError("");
    setLoading(true);
    try {
      const scored = scoreByDimension(INTEREST_QUESTIONS, interestAnswers);
      await API.post("/onboarding/interest", scored);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    if (!preferences.collegeType || !preferences.location || !preferences.budget || !preferences.studyMode) {
      return setError("Please answer every preference.");
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/onboarding/preferences", preferences);
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Education Level", "Basic Info", "Academics", "Aptitude", "Interests", "Preferences"];

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="progress-track">
          {stepLabels.map((label, i) => (
            <div key={label} className={`progress-dot ${i <= step ? "active" : ""}`}>
              <span className="dot" />
              <span className="dot-label">{label}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2>What are you currently studying?</h2>
            <div className="choice-row">
              <button
                className={`choice-card ${educationLevel === "class10" ? "selected" : ""}`}
                onClick={() => setEducationLevel("class10")}
              >
                Class 10
              </button>
              <button
                className={`choice-card ${educationLevel === "class12" ? "selected" : ""}`}
                onClick={() => setEducationLevel("class12")}
              >
                Class 12
              </button>
            </div>

            {educationLevel === "class12" && (
              <>
                <h3>Which stream?</h3>
                <div className="choice-row">
                  {["science", "commerce", "humanities", "other"].map((s) => (
                    <button
                      key={s}
                      className={`choice-card small ${stream === s ? "selected" : ""}`}
                      onClick={() => setStream(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {error && <p className="error-text">{error}</p>}
            <button className="primary-btn" onClick={handleStep0Next} disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2>Tell us about yourself</h2>
            <div className="form-grid">
              <input
                placeholder="Full name"
                value={basicInfo.fullName}
                onChange={(e) => setBasicInfo({ ...basicInfo, fullName: e.target.value })}
              />
              <input
                placeholder="Age"
                type="number"
                value={basicInfo.age}
                onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
              />
              <input
                placeholder="State"
                value={basicInfo.state}
                onChange={(e) => setBasicInfo({ ...basicInfo, state: e.target.value })}
              />
              <input
                placeholder="District"
                value={basicInfo.district}
                onChange={(e) => setBasicInfo({ ...basicInfo, district: e.target.value })}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="btn-row">
              <button className="secondary-btn" onClick={() => setStep(0)}>Back</button>
              <button className="primary-btn" onClick={handleStep1Next} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Academic scores</h2>
            <p className="subtext">Enter your latest marks or percentage for each subject (0-100).</p>

            <div className="form-grid">
              {defaultSubjects.map((subj) => (
                <div key={subj} className="field">
                  <label>{subj}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={academicScores[subj] ?? ""}
                    onChange={(e) =>
                      setAcademicScores({ ...academicScores, [subj]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}

              {/* Custom subjects the student has added - same input style,
                  plus a remove button since these weren't part of the
                  default list. */}
              {customSubjects.map((subj) => (
                <div key={subj} className="field custom-subject-field">
                  <label>
                    {subj}
                    <button
                      type="button"
                      className="remove-subject-btn"
                      onClick={() => removeCustomSubject(subj)}
                      title="Remove this subject"
                    >
                      &times;
                    </button>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={academicScores[subj] ?? ""}
                    onChange={(e) =>
                      setAcademicScores({ ...academicScores, [subj]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}
            </div>

            {/* Add-a-subject row - type a name, click Add, a new input
                appears above for entering that subject's score. */}
            <div className="add-subject-row">
              <input
                type="text"
                placeholder="Add another subject (e.g. Computer Science)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSubject())}
              />
              <button type="button" className="secondary-btn" onClick={addCustomSubject}>
                + Add subject
              </button>
            </div>

            {error && <p className="error-text">{error}</p>}
            <div className="btn-row">
              <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
              <button className="primary-btn" onClick={handleStep2Next} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Aptitude check</h2>
            <p className="subtext">Rate how much you agree, 1 (not at all) to 5 (very much).</p>
            {APTITUDE_QUESTIONS.map((q) => (
              <ScaleQuestion
                key={q.id}
                question={q}
                value={aptitudeAnswers[q.id]}
                onChange={(id, val) => setAptitudeAnswers({ ...aptitudeAnswers, [id]: val })}
              />
            ))}
            {error && <p className="error-text">{error}</p>}
            <div className="btn-row">
              <button className="secondary-btn" onClick={() => setStep(2)}>Back</button>
              <button className="primary-btn" onClick={handleStep3Next} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>What do you enjoy?</h2>
            <p className="subtext">Rate how much you'd enjoy each, 1 (not at all) to 5 (a lot).</p>
            {INTEREST_QUESTIONS.map((q) => (
              <ScaleQuestion
                key={q.id}
                question={q}
                value={interestAnswers[q.id]}
                onChange={(id, val) => setInterestAnswers({ ...interestAnswers, [id]: val })}
              />
            ))}
            {error && <p className="error-text">{error}</p>}
            <div className="btn-row">
              <button className="secondary-btn" onClick={() => setStep(3)}>Back</button>
              <button className="primary-btn" onClick={handleStep4Next} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2>A few preferences</h2>
            <div className="pref-group">
              <label>College type</label>
              <div className="choice-row">
                {["government", "private", "any"].map((v) => (
                  <button
                    key={v}
                    className={`choice-card small ${preferences.collegeType === v ? "selected" : ""}`}
                    onClick={() => setPreferences({ ...preferences, collegeType: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="pref-group">
              <label>Preferred location</label>
              <div className="choice-row">
                {["district", "state", "anywhere"].map((v) => (
                  <button
                    key={v}
                    className={`choice-card small ${preferences.location === v ? "selected" : ""}`}
                    onClick={() => setPreferences({ ...preferences, location: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="pref-group">
              <label>Budget</label>
              <div className="choice-row">
                {["low", "moderate", "any"].map((v) => (
                  <button
                    key={v}
                    className={`choice-card small ${preferences.budget === v ? "selected" : ""}`}
                    onClick={() => setPreferences({ ...preferences, budget: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="pref-group">
              <label>Study mode</label>
              <div className="choice-row">
                {["degree", "diploma", "vocational", "not_sure"].map((v) => (
                  <button
                    key={v}
                    className={`choice-card small ${preferences.studyMode === v ? "selected" : ""}`}
                    onClick={() => setPreferences({ ...preferences, studyMode: v })}
                  >
                    {v === "not_sure" ? "Not sure" : v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="btn-row">
              <button className="secondary-btn" onClick={() => setStep(4)}>Back</button>
              <button className="primary-btn" onClick={handleFinish} disabled={loading}>
                {loading ? "Finishing..." : "See my results"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}