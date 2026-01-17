const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

// GET all projects
router.get("/", getProjects);

// GET single project by ID
router.get("/:id", getProjectById);

// CREATE project (protected)
router.post("/", authMiddleware, createProject);

// UPDATE project (protected)
router.patch("/:id", authMiddleware, updateProject);

// DELETE project (protected)
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;