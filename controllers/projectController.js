const Project = require('../models/project');

// CREATE project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.userId, // from auth middleware
      members: [req.userId]
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE project
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is the creator (authorization)
    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE project
// DELETE project
// DELETE project
// DELETE project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.userId;

    // Allow delete if user is creator OR in members
    const isAuthorized = 
      (project.createdBy && project.createdBy.toString() === userId) ||
      project.members?.some(m => m.toString() === userId);

    if (!isAuthorized) {
      return res.status(403).json({ 
        message: "Only creator or members can delete this project" 
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: error.message });
  }
};