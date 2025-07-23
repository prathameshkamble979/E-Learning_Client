require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Use CORS with explicit settings
app.use(
  cors({
    origin: [
      "http://localhost:5173", // your local frontend
      "https://e-learning-frontend-xyz.onrender.com", // 🔁 your deployed frontend (replace this with your real URL)
    ],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");

app.use("/api/auth", authRoutes);
app.use("/api/instructor/media", mediaRoutes);
app.use("/api/instructor/courses", instructorCourseRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
