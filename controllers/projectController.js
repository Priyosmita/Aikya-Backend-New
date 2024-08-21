// projectController.js
const Project = require('../models/project');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Controller functions
const createProject = async (req, res) => {
  try {
    const { name, website, type, industry, details, startedIn, yearlyRevenue, monthlySales, grossMargin, netMargin, ebitda, skus, originalAsk, equityOffered, debtAmount } = req.body;
    const images = req.file ? req.file.path : req.body.images;

    const project = new Project({ name, website, type, industry, details, startedIn, yearlyRevenue, monthlySales, grossMargin, netMargin, ebitda, skus, originalAsk, equityOffered, debtAmount, images });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    console.error('Error Saving Project:', error);
    res.status(400).send(error);
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if file is uploaded
    const images = req.file ? req.file.path : req.body.images;

    // Update project with new data
    const updatedProject = await Project.findByIdAndUpdate(projectId, {
      ...req.body,
      images
    }, { new: true });

    if (!updatedProject) {
      return res.status(404).send('Project not found');
    }

    res.send(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Server error');
  }
};


const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { upload, createProject, getProjects, updateProject, deleteProject };
