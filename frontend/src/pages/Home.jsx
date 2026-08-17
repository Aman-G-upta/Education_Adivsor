import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Find the education path that actually fits you</h1>
        <p className="hero-subtext">
          Answer a few questions about your academics, aptitude, and interests -
          EduPath gives you a personalized, explained recommendation instead of
          a guess.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="hero-cta-primary">Get started</Link>
          <Link to="/login" className="hero-cta-secondary">I already have an account</Link>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">10</div>
          <h3>For Class 10 students</h3>
          <p>Get a recommended pathway - Science, Commerce, Humanities, Diploma, or Vocational - based on what you're actually good at.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">12</div>
          <h3>For Class 12 students</h3>
          <p>Get specific career recommendations, ranked and explained, so you know exactly why each one fits.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">%</div>
          <h3>Every score is explained</h3>
          <p>No black box - every recommendation comes with a match percentage and the specific reasons behind it.</p>
        </div>
      </section>
    </div>
  );
}