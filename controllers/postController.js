const Post = require('../models/post');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'aikya'  // Specify the folder path here
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Remove the file from local storage after upload
    }

    const newPost = new Post({
      title,
      description,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(400).send({ error: 'Failed to save post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).send(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ error: 'Failed to fetch posts' });
  }
};
