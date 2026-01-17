const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Force model registration
require("./models/User");
require("./models/project");
require("./models/task");

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));         // 👈 NEW - Authentication
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running! 🚀" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});