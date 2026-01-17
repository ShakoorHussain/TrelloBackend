const Task = require("../models/task");

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Todo",
      projectId: req.body.projectId,
      assignedTo: req.body.assignedTo,
      createdBy: req.userId // from auth middleware
    });

    // Populate before sending response
    await task.populate("projectId", "title");
    await task.populate("assignedTo", "name email");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all tasks with filters, pagination, and search
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 100, projectId, assignedTo, search } = req.query;

    const filter = {};

    // Filter by project
    if (projectId) {
      filter.projectId = projectId;
    }

    // Filter by assigned user
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate("projectId", "title")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      totalTasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "title")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE task (status, title, description, etc.)
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields if provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    // Populate before sending response
    await task.populate("projectId", "title");
    await task.populate("assignedTo", "name email");

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE task status only (for quick status changes)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("projectId", "title")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the creator (authorization)
    if (task.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};