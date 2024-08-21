const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), postController.createPost);
router.get('/', postController.getPosts);

module.exports = router;