// profileModel.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profilePicture: String,
  name: String,
  about: String,
  experience: String,
  certifications: [String],
  skills: [String],
});

module.exports = mongoose.model('Profile', profileSchema);
