import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Welcome, {user?.name}</h1>
        <p className="subtext">Career & Education Advisor Dashboard</p>

        <div className="btn-row">
          <button className="primary-btn" onClick={() => navigate("/results")}>
            View My Recommendations
          </button>
          <button className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;