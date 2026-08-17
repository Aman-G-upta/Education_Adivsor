import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Results from "./pages/Results";
import RoadmapDetail from "./pages/RoadmapDetail"; // <-- new
import CollegeFinder from "./pages/CollegeFinder";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import SkillGap from "./pages/SkillGap";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/college-finder" element={<CollegeFinder />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/results" element={<Results />} />
        <Route path="/simulator" element={<WhatIfSimulator />} />
        <Route path="/skill-gap/:careerId" element={<SkillGap />} />
        {/* :type is "career" or "pathway", :id is the career/pathway id */}
        <Route path="/roadmap/:type/:id" element={<RoadmapDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </>
  );
}

export default App;