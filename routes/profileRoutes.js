const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// POST route to create a new profile
router.post('/', upload.single('profilePicture'), profileController.createOrUpdateProfile);

// PUT route to update an existing profile
router.put('/', upload.single('profilePicture'), profileController.createOrUpdateProfile);

// GET route to fetch a profile
router.get('/', profileController.getProfile);

module.exports = router;