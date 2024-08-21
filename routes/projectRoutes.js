// projectRoutes.js
const express = require('express');
const router = express.Router();
const { upload, createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');

// Project routes
router.post('/', upload.single('images'), createProject);
router.get('/', getProjects);
router.put('/:id', upload.single('images'), updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
