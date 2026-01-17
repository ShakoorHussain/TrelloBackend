const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require("../controllers/taskControllers");

// GET all tasks (with filters, pagination, search)
router.get("/", getTasks);

// GET single task by ID
router.get("/:id", getTaskById);

// CREATE task (protected)
router.post("/", authMiddleware, createTask);

// UPDATE task - full update (protected)
router.put("/:id", authMiddleware, updateTask);

// UPDATE task status only - quick status change (protected)
router.patch("/:id", authMiddleware, updateTaskStatus);

// DELETE task (protected)
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;