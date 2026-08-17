import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Re-checking localStorage on every render (rather than storing this in
  // state) keeps the navbar simple - it just reflects whatever's true
  // right now. Since Login/Signup/logout all cause a navigation, which
  // re-renders this component anyway, it stays in sync without extra work.
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Don't show the navbar's auth links on the onboarding flow itself -
  // it's a focused, step-by-step task and shouldn't tempt a student to
  // navigate away mid-assessment.
  const hideLinks = location.pathname === "/onboarding";

  return (
    <nav className="navbar">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-brand">
        <span className="navbar-logo">E</span>
        ShikshaSetu
      </Link>

      {!hideLinks && (
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
               <Link to="/college-finder" className="navbar-link">College Finder</Link>
              <Link to="/results" className="navbar-link">My Recommendations</Link>
              <span className="navbar-user">Hi, {user?.name?.split(" ")[0]}</span>
               <Link to="/simulator" className="navbar-link">What-If Simulator</Link>
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-cta">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}


