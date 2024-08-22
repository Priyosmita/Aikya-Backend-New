const express = require('express');
const router = express.Router();
const fundingController = require('../controllers/fundingController');
const multer = require('multer');

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST route to create a new funding entry
router.post('/funding', upload.single('image'), fundingController.createFunding);


// GET route to retrieve all funding entries
router.get('/funding', fundingController.getFunding);

module.exports = router;
