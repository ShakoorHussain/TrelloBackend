const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// CORS Configuration - Allow your Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://trello-frontend-421p.vercel.app',  // Replace with your actual Vercel URL
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Force model registration
require("./models/User");
require("./models/project");
require("./models/task");

const PORT = process.env.PORT || 5000;

// MongoDB Connection - FIXED: Support both MONGO_URI and MONGODB_URI
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ ERROR: MongoDB URI not found in environment variables!");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Task Management API is running! 🚀",
    status: "active",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    availableRoutes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/projects",
      "POST /api/projects",
      "GET /api/tasks",
      "POST /api/tasks",
      "GET /api/users"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});