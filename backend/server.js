const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Career Advisor API is running",
  });
});


// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://shikhsasetu.vercel.app"   // add after you deploy frontend
  ],
  credentials: true
}));

app.use("/api/skill-gap", require("./routes/skillGapRoutes"));
app.use("/api/college-finder", require("./routes/collegeFinderRoutes"));
app.use("/api/roadmap", require("./routes/roadmapRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/onboarding", require("./routes/onboardingRoutes"));
app.use("/api/recommendation", require("./routes/recommendationRoutes"));   // <-- add this line
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});